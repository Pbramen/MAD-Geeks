import 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { successfulResponse, failedResponse } from '../../standardizeJSONResposne';
import { StatusCode } from '../../../response/ReturnCode';

// endpoints
const handle_refresh_token = (req : Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;

    // no error thrown on invalid client input/usage
    if (!cookies?.jwt) {
        failedResponse({
            res: res,
            code: StatusCode.BAD_REQUEST,
            status: 'Unauthorized',
            message: 'No valid JWT token found',
            descript: 'JWT_404'
        });
        return next();
    }

    const refresh_token = cookies.jwt;
    jwt.verify(
        refresh_token, process.env.REFRESH_TK_S,
        async (err: Error, decoded: any) => {
            if (err || !decoded) {
                failedResponse({
                    res: res,
                    code: StatusCode.UNAUTHORIZED,
                    status: 'Unauthorized',
                    message: 'No valid JWT token found',
                    descript: 'JWT_VERIFY_FAILED'
                });
                return next(err);
            }
            if (decoded) {
                
            }
        }
    )
}

const verify_JWT = (req: Request, res: Response, next: NextFunction) => {
    
}

/**
 * Returns a new access token if user session has not expired.
*/
const check_if_user_logged_in = () => { }