const mongoose = require('mongoose');
const { sys_err_model } = require('../mongoFunctions/schemas/logging_schema');
const { ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require('../errorHandling/ValidationError');

/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, req, res, next) => {
    // in seconds;
    const duration = (Date.now() - res.locals.timer) / 1000

    // error occured during validation state
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError) {;
        const log_entry = sys_err_model({...err.getRes(), duration: duration});
        log_entry.save().then(() => {
               console.log("log successful.")
           }
        ).catch((e) => {
            console.log(e);
            mongoose.connection.emit("error", e, err.data, true);    
        })
    }
    if (err instanceof MongoDuplicateError) {
        console.log(err);
        console.log(req.originalUrl);
    }

}

module.exports = errorHandler;