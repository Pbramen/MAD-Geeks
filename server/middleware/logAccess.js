const mongoose = require('mongoose');
const { sys_err_model } = require('../mongoFunctions/schemas/logging_schema');
const { CustomLogger, ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require('../errorHandling/ValidationError');

/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, req, res, next) => {
    // in seconds;
    const final = Date.now();
    const duration = Date.now() - res.locals.startTime;
    console.log(duration);

    // error occured during validation state
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError) {
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
    else {
        // other unspecified error here...
        try {
            
            if (err.name === 'MongoNotConnectedError' && res.locals.response !== undefined) {
                const data = CustomLogger.formatRes(req);
                data['response'] = res.locals.response;
                mongoose.connection.emit("error", err.name, data);
                
            }
            else if (res.locals.response) {
                
            }
        } catch (e) {
            // log error to log file instead
            mongoose.connection.emit("error", e, err);
        }
    }
}

module.exports = errorHandler;