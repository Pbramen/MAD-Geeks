const {hashNewPassword, compareHash} = require('../../enbcrypt.js');
const { userModel } = require('../../mongoFunctions/schemas/client_Schema.js');
const { createUser } = require("../../mongoFunctions/query/postQuery.js");
const { signAccessToken, signRefreshToken } = require("../../jwt/jwtokenHandler.js");
const jwtConfig = require('../../jwt/jwtCookieConfig.js');
const { handleMissingFields } = require("../../errorHandling/connectionError.js");
const { validationResult } = require('express-validator');
const {ExpressValidatorError, InvaildAuthError} = require("../../errorHandling/ValidationError.js");


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
 * @param {Object} req 
 * @param {Object} res 
 * @returns {JSON} Status
 */
async function createNewUser(req, res, next) {
    const json = req.body;
    const { password, userLogin, email, DOB } = json;

    // check for valid parameters
    if (password != undefined && userLogin !== undefined && email !== undefined && DOB !== undefined) {
        try {
            let hashed = await hashNewPassword(json.password);
            await createUser(json, hashed, [100]);
            let result = {
                "status": 'ok',
                "msg": `${json.userLogin} successfully created!`,
                "link": '/login' // redirect user back to login screen.
            }
            console.log(result);
            return res.status(200).json(result);
        } catch (e) {
            //console.log(e);
            let err = { errors: [] };
            let status = { code: 200 };
            err = handleError(e, err, status);
            res.status(status.code).json(err);
            next(e);
        }
    }
    // request client for missing params.
    else {
        var param = []
        if (password === undefined) {
            param.push("password");
        }
        if (email === undefined) {
            param.push("email");
        }
        if (userLogin === undefined) {
            param.push("user login");
        }
        if (DOB === undefined) {
            param.push("DOB")
        }
        const response = handleMissingFields(param);
        return res.status(422).json(response);
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

                    if (other[0].userDetail[0].banned.value) {
                        return res.status(403).json({
                            'status': 'DENIED',
                            'msg': 'ACC_BANNED',
                            'link': '/accountBanned'
                        })
                    }

                    if (other[0].activity.active !== true ) {
                        return res.status(403).json({
                            'status': 'DENIED',
                            'msg': 'ACC_DISABLED',
                            'link': '/accountDisabled'
                        }
                        )
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
                        return res.status(200).json({
                            'status': 'SUCCESS',
                            'msg': 'AUTH_OK',
                            'link': '/home',
                            'roles': roles,
                            'accessToken': accessToken
                        })
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
                return res.status(404).json({
                    'status': 'DNE',
                    'msg': `Not registered`,
                    'link': '/register'
                })
                // log here...
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
        console.log(err.getData());
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
