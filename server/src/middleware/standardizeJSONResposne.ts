import 'dotenv';
import { Response } from "express";

type JSONResponeSchema = {
    status: string, 
    message: string,
    payload?: any,
    [key: string]: any
}

const standardResponse = (res: Response, code: number, status: string, message: string, payload?: any, rest?: any) => {
    if (res.headersSent === true) {
        return; 
    }

    if (code > 501) {
        code = 500;
    }
    var json : JSONResponeSchema= {
        status: status,
        message: message,
    }

    if (payload !== null) {
        json["payload"] = payload;
    }
    res.status(code).json(json);
}

export const successfulResponse = (res: Response, code: number, status: string, message: string, payload?: any, rest?: any) => {
    standardResponse(res, code, status, message, payload, rest);
    if (process.env.NODE_ENV == 'development') {
        console.log('Response successfully sent')
    }
}

export const failedResponse = (res: Response, code: number, status: string, message: string, payload?: any, rest?: any) => {
    standardResponse(res, code, status, message, payload, rest);
    if (process.env.NODE_ENV == 'development') {
        console.log('Response failed successfully')
    }
}