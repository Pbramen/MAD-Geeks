import { Request, Response, NextFunction } from 'express';
import { User } from '../../../postgress/model/user';

import { successfulResponse, failedResponse } from '../../standardizeJSONResposne';
import { StatusCode } from '../../../response/ReturnCode';
import { check_password, generate_salt } from '../../../secure/bcrypt';

/**
 * Sends back a session token if the user is successfully logged in!
*/
export const sign_in = ( (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;    
    
    User.login(body).then(result => { 
        if (result) {
            // TODO: generate token to send back to client
            if (check_password(body.password, result.password)) {
                successfulResponse({
                    res: res,
                    code: StatusCode.OK,
                    status: 'Ok',
                    message: 'Authorized',
                    descript: 'LOGIN_SUCCESS'
                });
            }
            else {
                failedResponse({
                    res: res,
                    code: StatusCode.NOT_FOUND,
                    status: 'Failed',
                    message: 'Incorrect login combination',
                    descript: 'LOGIN_400',
                    rest: { 'action': '/register' }
                })
            }
        }
        else {
            failedResponse({
                res: res,
                code: StatusCode.NOT_FOUND,
                status: 'Failed',
                message: 'Account username/email/password combination does not exits.',
                descript: 'USER_404',
                rest: { 'action': '/register' }
            })
        }
        }).catch(next)
})

/**
 * Registers user into database
*/
export const register = (async (req: Request, res: Response, next: NextFunction) => { 
    console.log("called register!")
    const body = req.body;
    User.findUser(body).then(async (results) => {

        // username/email is not unique => do not create.
        if (results !== null) {
            var message = 'Email is already taken.';
            if (results.username === body.username) {
                message = 'Username is already taken.';
            }
            failedResponse({
                res: res,
                code: StatusCode.BAD_REQUEST,
                status: 'Failed',
                message: message,
                descript: message
            })
            
        }
        // good to go! 
        else {
            body.password = await generate_salt(body.password);
            User.register(body)
                .then( _ => {
                    successfulResponse({
                        res: res,
                        code: StatusCode.OK,
                        status: 'OK',
                        message: 'Registration complete!',
                        descript: 'RESIGTER_OK'
                    })
                })
        }
    }).catch(next);


})

/**
 * Clears session token 
*/
export const logout = ((req: Request, res: Response, next: NextFunction) => { 
    const body = req.body;
})