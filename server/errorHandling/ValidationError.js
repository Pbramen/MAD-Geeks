class ValidationError extends Error{
    constructor(message, status_code ) {
        super(message);
        this.status_code = status_code || 500
        this.name = "ValidationError"
    }
}

class PropertyNullError extends ValidationError{
    constructor(message, status_code) {
        super(message, status_code, data);
        this.name = "PropertyNullError";
    }
}

class PropertyTypeError extends ValidationError {
    constructor(message, status_code) {
        super(message, status_code);
        this.name = "PropertyTypeError";
    }
}

module.exports = { ValidationError, PropertyNullError, PropertyTypeError}