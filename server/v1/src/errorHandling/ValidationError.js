require("dotenv").config();


// TODO: need to revise this entire class 

const formatData = (req) => {
    return {
        endpoint: req.originalUrl,
        method: req.method,
        protocol: req.protocol,
        version: process.env.VERSION,
        origin: req.hostname
    }
}

class CustomLogger extends Error{
    data = {} // data that will be stored in the db.
    // json that was sent back to the client side
    constructor(message, resJSON, req) {
        super(message);
        this.resJSON = resJSON;
        if (new.target === CustomLogger) {
            throw new Error('Cannot instanciate this class. Use child classes instead.');
        }
    }

    formatLog(req) {
        const obj = formatData(req);
        obj['reqBody'] = this.formatReqBody(req.body);
        return obj;
    }

    formatReqBody(body) {
        const blackList = new Set(['password', 'accessToken', 'jwt', 'refreshToken'])
        const obj = {};
        
        Object.keys(body).forEach(key => {
            if (!blackList.has(key)) {
                obj[key] = body[key];
            } else { 
                obj[key] = 'REDACTED'
            }
        })
        return obj;
    }

    
    printData() {
        console.log("----       LOGGED DATA          ----");
        console.log(JSON.stringify(this.data));
        console.log("----           END              ----");
    }


    getData() {
        return this.data;
    }

    getRes() {
        return this.resJSON;
    }
}

class InvalidParameters extends CustomLogger{
    data = {};
    constructor(message, resJSON, req){
        super(message, resJSON, req);
        console.log(message, resJSON);
        this.data = this.formatLog();
        this.name = "InvalidParameters";
        this.code = 400;
        Error.captureStackTrace(this, this.constructor);
    }

    formatLog() {
        super.formatLog(this.data)
        const obj = {'err_s': this.data};
        return obj;
    }
}

class ExpressValidatorError extends CustomLogger{
    data = {};
    constructor(message, resJSON, req){
        super(message, resJSON, req);
        this.data = this.formatLog(data);
        this.name = "ExpressValidatorError";
        Error.captureStackTrace(this, this.constructor);
    }

    formatLog(data) {
        super.this.formatLog(data)
        obj['err_s'] = data;
        return obj;
    }
}

class InvaildAuthError extends CustomLogger{
    
    constructor(message, resJSON, req){
        super(message, resJSON, req);
        this.data = this.formatLog(data);
        this.name = "InvalidAuthError";
        Error.captureStackTrace(this, this.constructor);
    }

    formatLog(json) {
        const obj = super.formatLog(json);
        obj['response'] = json;
        return obj;
    }
}


class MongoDuplicateError extends CustomLogger{
    constructor(message, resJSON, req) {
        super(message, resJSON, req);
        this.data = this.formatLog(req);
        this.name = "MongoDuplicateError";
        this.code = 11000;
        Error.captureStackTrace(this, this.constructor);
    }
    formatLog(json) {
        var obj = super.formatLog(json);
        obj['response'] = this.resJSON;
        return obj;
    }
}

module.exports = {
    ExpressValidatorError,
    InvaildAuthError,
    MongoDuplicateError,
    InvalidParameters,
    formatData
};