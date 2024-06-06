
class InvalidParams extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }

    log_error() {
        // ... log error here...
    }
}

module.exports = InvalidParams;