import { Response, Request, NextFunction } from "express"
import { StatusCode } from "../response/ReturnCode";
import 'dotenv';

import { failedResponse } from "../middleware/standardizeJSONResposne";

export const customErrorRoute = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if(process.env.NODE_ENV == 'development')    
        printEntryErrorRoute(err);

    if (!res.headersSent) {
        console.error('bruh...');
        failedResponse({
            res: res,
            code: res.locals?.err_code || StatusCode.BAD_REQUEST,
            status: 'ERROR',
            message: err.message,
            descript: 'DEFECT_ERROR_RESPONSE'
        });
    }
}

const printEntryErrorRoute = (err: Error) => {
    console.log('\t=========== Custom Error Message Reached ===========')
    console.log(`\t* ${err.message}`);
    console.log(`\t ${err.stack}`)
}