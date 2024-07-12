const path = require('path')
const { hashNewPassword, compareHash } = require(path.join(__dirname, '..','..','enbcrypt.js'));
const { userModel } = require(path.join( __dirname, '..','..','mongoFunctions','schemas','client_Schema.js'));
const { createUser, checkDuplicates } = require(path.join(__dirname, '..','..','mongoFunctions','query','postQuery.js'));
const { signAccessToken, signRefreshToken } = require(path.join(__dirname, '..','..','jwt','jwtokenHandler.js'));
const jwtConfig = require(path.join(__dirname, '..', '..', 'jwt', 'jwtCookieConfig.js'));
const jwt = require('jsonwebtoken');
const { set } = require('mongoose');
const { InvaildAuthError, MongoDuplicateError } = require(path.join(__dirname, '..', '..', 'errorHandling', 'ValidationError.js'));
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
            res.status(409).json(response);
            const err = new MongoDuplicateError("Duplicate user found",  res.locals.response, req);
            next(err);
        }
        else {
            console.log("Setting up new user...")
            let hashed = await hashNewPassword(json.password);
            await createUser(json, hashed, [100]);

            res.status(200).json({
                "status": 'ok',
                "msg": `${json.username} successfully created!`,
                "link": '/login' // redirect user back to login screen.
            });
            next();
        }
    } catch (e) {
        next(e);
    }
}


async function isValidAuth(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
        try {
            const result = await userModel.exists({
                userLogin: username,
            });
            
            console.log(Date.now() - res.locals?.startTime);
            
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
                        //console.log(Date.now() - res.locals?.startTime);
                        res.status(403).json({
                            'status': 'DENIED',
                            'msg': 'ACC_BANNED',
                            'link': '/accountBanned'
                        })

                        const err = new InvaildAuthError("User banned",  res.locals.response, req);
                        next(err);
                    }

                    if (other[0].activity.active !== true) {

                        res.status(403).json({
                            'status': 'DENIED',
                            'msg': 'ACC_BANNED',
                            'link': '/accountBanned'
                        })
                        const err = new InvaildAuthError("User account disabled",  res.locals.response, req);
                        next(err);
                    }
                    
                    var auth = await compareHash(password, other[0].password);
                   
                    if (auth) {
                        const roles = other[0].userDetail[0].role;
                        const tk = other[0]['refreshToken'];
                        console.log(tk);

                        jwt.verify(tk, process.env.REFRESH_TK_S, async (err, decoded) => { 
                            const accessToken = signAccessToken(other[0].userLogin);
                            if (err || decoded?.username !== username) {
                                
                                console.log("<------ User session started ----->")
                                // user has not signed in or refresh token has expired...
                                const refreshToken = signRefreshToken(other[0].userLogin);
                                res.cookie(jwtConfig.name, refreshToken, jwtConfig.options);
                                // save refreshToken here
                                await userModel.findOneAndUpdate({ _id: other[0]._id }, { refreshToken: refreshToken });
                            }
                            else {
                                console.log("<------ User session continued ----->")
                                res.cookie(jwtConfig.name, tk, jwtConfig.options);
                            }
                            
                            res.status(200).json({
                                'status': 'SUCCESS',
                                'msg': 'AUTH_OK',
                                'link': '/home',
                                'roles': roles,
                                'accessToken': accessToken
                            });
                            next();
                        })
                        
                    }
                    else {
                        
                        res.status(401).json({
                            'status': 'DENIED',
                            'msg': "Invalid combination",
                            'link': '/login'
                        } )
                        const err = new InvaildAuthError("invalid user/password combination",  res.locals.response, req);
                        next(err);
                    }
                }
                else {
                    // this should not run....
                    res.status(404).json({
                        'status': 'DNE',
                        'msg': `Interrupted.`,
                        'link': '/register'
                    })
                    const err = new Error(`User (${username}) updated/deleted or process interrupted before authenticating`);
                    next()
                }
            }
            else {
                res.status(404).json( {
                    'status': 'DNE',
                    'msg': `Not registered`,
                    'link': '/register'
                });
                const err = new InvaildAuthError("User not registered", res.locals.response, req);
                next(err);
            }
        } catch (e) {
            next(e);
        } 
}


module.exports = {
    test1, createNewUser, isValidAuth
}
