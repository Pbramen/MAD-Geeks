import 'dotenv';
import { Response } from "express";

type JSONResponeSchema = {
    status: string, 
    message: string,
    payload?: any,
    [key: string]: any
}


type ResponseParameters = {
    res: Response, 
    code: number,
    status: string, 
    message: string,
    descript: string, 
    payload?: any,
    rest?: any
}
const standardResponse = (props: ResponseParameters) => {
    if (props.res.headersSent === true) {
        return; 
    }

    // hide details of interal server failure from client
    if (props.code > 501) {
        props.code = 400;
    }

    // description of the results : used for internal logging purposes. 
    props.res.locals.descript = props.descript; 

    var json : JSONResponeSchema= {
        status: props.status,
        message: props.message,
    }

    if (props.payload !== null) {
        json["payload"] = props.payload;
    }
    if (props.rest != null) {
        json = {...json, ...props.rest}
    }
    props.res.status(props.code).json(json);
}

export const successfulResponse = (props: ResponseParameters) => {
    standardResponse(props);
    if (process.env.NODE_ENV == 'development') {
        console.log('Response successfully sent')
    }
}

export const failedResponse = (props: ResponseParameters) => {
    standardResponse(props);
    if (process.env.NODE_ENV == 'development') {
        console.log('Response failed successfully')
    }
}