const { formatData, ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require('../../../errorHandling/ValidationError');

/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, model) => {

    // error occured during validation 
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError) {
       
    }
    else if (err instanceof MongoDuplicateError) {
       
    }
    else {
        // handle database connection error here 
        if (res.locals.response !== undefined) {
            
        }
        else {
            throw new Error('res.locals.response must be set for interal server errors!');
        }
    }
}

module.exports = errorHandler;