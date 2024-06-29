class CustomError extends Error{
    data = {}
    constructor(message, data, req) {
        super(message);
        if (new.target === CustomError) {
            throw new Error('Cannot instanciate this class. Use child classes instead.');
        }
    }

    formatData(req) {
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
}

class ExpressValidatorError extends CustomError{
    data = {};
    constructor(message, data, req){
        super(message);
        this.data = this.formatData(data, req);
        Error.captureStackTrace(this, this.constructor);
    }

    formatData(data, req) {
        const obj = super.formatData(req);
        obj['err_s'] = data;
        return obj;
    }

}

class InvaildAuthError extends CustomError{
    data = {};
    constructor(message, data, req){
        super(message);
        this.data = this.formatData(data, req);
        Error.captureStackTrace(this, this.constructor);
    }

    formatData(data, req) {
        const obj = super.formatData(req);
        obj['response'] = data;
        return obj;
    }
}

module.exports = {
    ExpressValidatorError,
    InvaildAuthError
};