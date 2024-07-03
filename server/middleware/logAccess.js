const mongoose = require('mongoose');
const { sys_err_model } = require('../mongoFunctions/schemas/logging_schema');
const { formatData, ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require('../errorHandling/ValidationError');

/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, req, res, next) => {
    // in seconds;
    const final = Date.now();
    const duration = Date.now() - res.locals.startTime;
    console.log(duration);

    if (err instanceof ExpressValidatorError)
        console.log("Express");
    if (err instanceof InvaildAuthError)
        console.log("Invalid");
    if (err instanceof MongoDuplicateError)
        console.log("MongoDuplicate")
    
    // error occured during validation state
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError ||
        err instanceof MongoDuplicateError) {
        const response = err?.getRes() || {}
        const log_entry = sys_err_model({...response, duration: duration});
        log_entry.save().then(() => {
               console.log("log successful.")
           }
        ).catch((e) => {
            console.log(e);
            mongoose.connection.emit("error", e, err?.data, true);    
        })
    }
    else {
        // handle database connection error here 
        const data = formatData(req);
            
        if (res.locals.response !== undefined) {
            data['response'] = res.locals.response;
            mongoose.connection.emit("error", err.name, data, true);
        }
        else {
            // error has been thrown before any middleware or route was reached.
            if (res.headersSent === false) {
                res.locals.response = {
                    status: err.status || err.code || 400,
                    name: err.name || err.type || "N/A",
                    msg: err.message || err.msg || "Unexpected Error"
                }
                data['err_s'] = {
                    type: res.locals.response.name,
                    msg: res.locals.response.msg,
                    location: 'body'
                };
                res.status(res.locals.response.status).json(res.locals.response)
            }
            try {
                // TODO : format special error case here
                const log_entry = await sys_err_model.create(data);
            } catch (e) {
                console.error("logging error entry failed");
                mongoose.connection.emit("error", err.name || err.type, data, true);
            }
            return;
        }
    }
}

module.exports = errorHandler;