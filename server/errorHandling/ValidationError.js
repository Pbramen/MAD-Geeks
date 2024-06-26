class ExpressValidatorError extends Error{
    constructor(message, data){
        super(message);
        this.data = data;
    }
}

module.exports = ExpressValidatorError;