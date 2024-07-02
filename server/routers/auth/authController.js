const {hashNewPassword, compareHash} = require('../../enbcrypt.js');
const { userModel } = require('../../mongoFunctions/schemas/client_Schema.js');
const { createUser, checkDuplicates } = require("../../mongoFunctions/query/postQuery.js");
const { signAccessToken, signRefreshToken } = require("../../jwt/jwtokenHandler.js");
const jwtConfig = require('../../jwt/jwtCookieConfig.js');
const { validationResult } = require('express-validator');
const {ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require("../../errorHandling/ValidationError.js");
const { generateErrorResponse, setContext } = require("../../errorHandling/customError.js");
const { logAPIAccess } = require("../../middleware/logSuccessAPI.js");

require("dotenv").config();

/**
 * TODO: remove before production deploy 
 * @returns 
 */
async function test1(req, res) { 
    console.log("finding all users...");
    const response = await userModel.find({}).select('userLogin');
    return res.status(200).json(response);
}


/**
 * Creates a new user and auth info
 * Validation/sanitation occurs before this function is called!
 */

async function createNewUser(req, res, next) {
    
    const json = req.body;
    try {
        let response = await checkDuplicates(json);
        if (response !== 0) {
            const err = new MongoDuplicateError("Duplicate user found", response);
            res.status(409).json(err.data);
            next(err);
        }
        else {
            console.log("Setting up new user...")
          
            let hashed = await hashNewPassword(json.password);
            await createUser(json, hashed, [100]);
            let result = {
                "status": 'ok',
                "msg": `${json.userLogin} successfully created!`,
                "link": '/login' // redirect user back to login screen.
            }
            return res.status(200).json(result);

        }
    } catch (e) {
        // unknown error type is thrown.
        const err = generateErrorResponse(e);
        res.locals.response = err;
        res.status(err.status).json(err);
        next(e);
    }
}



async function isValidAuth(req, res, next) { 
    const result = validationResult(req);
    if (result && Object.keys(result.errors).length === 0) {
        const { username, password } = req.body;
        try {
            const result = await userModel.exists({
                userLogin: username,
            });
            
            if (result) {
                const other = await userModel.aggregate([
                    {
                        $match: {userLogin: username}
                    },
                    {
                        $lookup: {
                            from: 'useraccounts',
                            localField: '_id',
                            foreignField: 'userAuthId',
                            as: 'userDetail'
                        }
                    },
                    {
                        $limit: 1
                    }
                ]);


                if (other.length !== 0) {
                    // reject banned/disabled users
                    if (other[0].userDetail[0].banned.value) {
                        const res_obj = {
                            'status': 'DENIED',
                            'msg': 'ACC_BANNED',
                            'link': '/accountBanned'
                        }
                        res.status(403).json(res_obj)
                        const err = new InvaildAuthError("User banned", res_obj, req);
                        next(err);
                    }

                    if (other[0].activity.active !== true) {
                        const res_obj = {
                            'status': 'DENIED',
                            'msg': 'ACC_DISABLED',
                            'link': '/accountDisabled'
                        }
                        res.status(403).json(res_obj)
                        const err = new InvaildAuthError("User account disabled", res_obj, req);
                        next(err);
                    }
                    
                    var auth = await compareHash(password, other[0].password);
                   
                    if (auth) {
                        const roles = other[0].userDetail[0].role;
                        const accessToken = signAccessToken(other[0].userLogin);
                        const refreshToken = signRefreshToken(other[0].userLogin);
           
                        // save refreshToken here
                        try {
                            userModel.findOneAndUpdate({_id: other._id}, {refreshToken: refreshToken});
                        } catch (e) {
                            console.log(e);
                        }

                        res.cookie(jwtConfig.name, refreshToken, jwtConfig.options);
                        const res_obj = {
                            'status': 'SUCCESS',
                            'msg': 'AUTH_OK',
                            'link': '/home',
                            'roles': roles,
                            'accessToken': accessToken
                        };
                        logAPIAccess(req, res, response = res_obj);
                        return res.status(200).json(res_obj)
                    }
                    else {
                        const response_obj = {
                            'status': 'DENIED',
                            'msg': "Invalid combination",
                            'link': '/login'
                        } 
                        res.status(401).json(response_obj)
                        const err = new InvaildAuthError("invalid user/password combination", response_obj, req);
                        next(err);
                    }
                }
                else {
                    // this should not run....
                    return res.status(404).json({
                        'status': 'DNE',
                        'msg': `Not registered`,
                        'link': '/register'
                    })
                }
            }
            else {
                const res_obj = {
                    'status': 'DNE',
                    'msg': `Not registered`,
                    'link': '/register'
                }
                res.status(404).json(res_obj);
                const err = new InvaildAuthError("User not registered", res_obj, req);
                next(err);
            }
        } catch (e) {
            res.status(500).json({ "status": 'DB_ERR', 'msg': e.message })
            next(e);
        }
    } 

    else {
        res.status(422).json(result);
        console.log("Missing parameters...");
        console.log(result.errors);
        const err = new ExpressValidatorError("Express Validator error", result.errors, req);
        next(err);
    }
}

/**
 * Handles errors POST/PUT database operations.
 * @param {Error} error - error object being caught
 * @returns {object} JSON object to be returned to client side.
 */
const handleError = (error, err, status) => {

    // Conflict => attempted to insert a duplicate key for unique index.
    if (error.hasOwnProperty('code') && error.code == 11000) {
        status.code = 409
        if (error.hasOwnProperty("keyPattern") && error.hasOwnProperty("keyValue")) {
            Object.getOwnPropertyNames(error.keyPattern).forEach((el) => {
                err.errors.push({
                    path: el,
                    message: `${el} must be unique.`,
                    value: error.keyValue[el]
                })
            })
            //LOG ERROR HERE
        }
        return err;
    }
    else if (err instanceof mongoose.Error.CastError) {
        console.log(err);
        err = {
            'errors': [{
                message: 'Cast Error'
            }]
        }
    }
    // handle custom Validator errors:
    else if (error.hasOwnProperty('errors')) {
        
        Object.values(error.errors).forEach((el) => {
            let props = el.properties;
            err.errors.push(
                {
                    path: props?.path,
                    message: props?.message
                }
            )
            // LOG ERROR HERE
            //console.log(props);
        });
    
        return err;
    }
    else {
        // LOG ERROR
        status.code = 422;
        err.errors.push({
            code: error.code,
            message: error.message,
        })
        err['action'] = 'Try again later';
    }
    return err;
}

module.exports = {
    test1, createNewUser, isValidAuth
}
