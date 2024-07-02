class CustomLogger extends Error{
    data = {}
    response = {}
    constructor(message, data, req) {
        super(message);
        if (new.target === CustomLogger) {
            throw new Error('Cannot instanciate this class. Use child classes instead.');
        }
    }

    static formatRes(req) {
        return {
            endpoint: req.originalUrl,
            method: req.method,
            protocol: req.protocol,
            version: process.env.VERSION,
            origin: req.hostname
        }
    }

    printData() {
        console.log("");
        console.log(JSON.stringify(this.data));
        console.log("");
    }


    getData() {
        return this.data;
    }
    getRes() {
        return this.response;
    }
}


class ExpressValidatorError extends CustomLogger{
    data = {};
    constructor(message, data, req){
        super(message);
        this.response = this.formatRes(data, req);
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }

    formatRes(data, req) {
        const obj = super.formatRes(req);
        obj['err_s'] = data;
        obj['reqBody'] = req.body;
        return obj;
    }
}

class InvaildAuthError extends CustomLogger{
    
    constructor(message, data, req){
        super(message);
        this.data = data;
        this.response = this.formatRes(data, req);
        Error.captureStackTrace(this, this.constructor);
    }

    formatRes(data, req) {
        const obj = super.formatRes(req);
        obj['response'] = data;
        obj['reqBody'] = req.body;
        return obj;
    }
}


class MongoDuplicateError extends CustomLogger{
    constructor(message, data) {
        super(message);
        this.name = "MongoDuplicateError";
        this.data = this.formatData(data);
        this.code = 11000;
    }

    formatData(data, req) {
        var msg = data.reduce((accum, curr) => {
            return accum + `${curr.path}, `;
        }, "").slice(0, -2) + ' must be unique';
        
        const obj = {
            status: "DUP_ERR",
            msg: msg, 
            errors: data
        }
        return obj;    
    }
}

module.exports = {
    ExpressValidatorError,
    InvaildAuthError,
    MongoDuplicateError,
    CustomLogger
};