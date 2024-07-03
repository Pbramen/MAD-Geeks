const {hashNewPassword, compareHash} = require('../../enbcrypt.js');
const { userModel } = require('../../mongoFunctions/schemas/client_Schema.js');
const { createUser, checkDuplicates } = require("../../mongoFunctions/query/postQuery.js");
const { signAccessToken, signRefreshToken } = require("../../jwt/jwtokenHandler.js");
const jwtConfig = require('../../jwt/jwtCookieConfig.js');
const { InvaildAuthError, MongoDuplicateError} = require("../../errorHandling/ValidationError.js");
const { generateErrorResponse, setContext } = require("../../errorHandling/customError.js");

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
 * validation -> faster response than ORM 
*/
async function createNewUser(req, res, next) {
    const json = req.body;
    try {
        let response = await checkDuplicates(json);
        if (response !== 0) {
            res.locals.response = response;
            const err = new MongoDuplicateError("Duplicate user found", response, req);

            res.status(409).json(err.getRes().response);
            next(err);
        }
        else {
            console.log("Setting up new user...")
            let hashed = await hashNewPassword(json.password);
            await createUser(json, hashed, [100]);
            
            res.locals.result = {
                "status": 'ok',
                "msg": `${json.userLogin} successfully created!`,
                "link": '/login' // redirect user back to login screen.
            }
            res.status(200).json(res.locals.result);
            next();
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
    const username = req.body.userLogin;
    const password = req.body.password;
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
                        userModel.findOneAndUpdate({_id: other._id}, {refreshToken: refreshToken});
                        
                        res.cookie(jwtConfig.name, refreshToken, jwtConfig.options);
                        res.locals.res_obj = {
                            'status': 'SUCCESS',
                            'msg': 'AUTH_OK',
                            'link': '/home',
                            'roles': roles,
                            'accessToken': accessToken
                        };
                        res.status(200).json(res_obj);
                        next();
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
                    res.local.response = {
                        'status': 'DNE',
                        'msg': `Interrupted.`,
                        'link': '/register'
                    }
                    res.status(404).json(res.local.response)
                    const err = new Error(`User (${username}) updated/deleted or process interrupted before authenticating`);
                    next()
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
            const err = generateErrorResponse(e);
            res.locals.response = err;
            res.status(err.status).json(err)
            next(e);
        } 
}

module.exports = {
    test1, createNewUser, isValidAuth
}
