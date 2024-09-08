import { Response, Request, NextFunction } from "express"
import { StatusCode } from "../ReturnCodes/ReturnCode";
import 'dotenv';

import { failedResponse } from "../middleware/standardizeJSONResposne";

export const customErrorRoute = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if(process.env.NODE_ENVIORNMENT == 'development')    
        printEntryErrorRoute(err.message);

    failedResponse(res, res.locals?.err_code || StatusCode.BAD_REQUEST, "Error", err.message);
}

const printEntryErrorRoute = (message: string) => {
    console.log('\t=========== Custom Error Message Reached ===========')
    console.log(`\t\t${message}`);
}