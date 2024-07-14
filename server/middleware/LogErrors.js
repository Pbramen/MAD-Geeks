const mongoose = require('mongoose');
const path = require("path");
const root = process.cwd();
const { sys_err_model } = require(path.join(root, 'mongoFunctions','schemas','logging_schema'));
const { formatData, ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require(path.join(root, 'errorHandling','ValidationError'));
const { generateErrorResponse } = require(path.join(root, 'errorHandling', 'customError'));
require('dotenv').config();
/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') { 
        console.log('LOGGERS ...');
        return;
    }
    
    // in ms;
    const duration = res.locals?.startTime ? (Date.now() - res.locals.startTime) : 0;

    // error occured during validation state
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError ||
        err instanceof MongoDuplicateError) {
        const data = err?.getData() 
        
        const log_entry = sys_err_model({...data, duration: duration});
        log_entry.save().then(() => {
               console.log("Logged CustomError success")
           }
        ).catch((e) => {
            console.log(e);
            mongoose.connection.emit("error", e, err?.getData(), true);    
        })
    }
    else {
        // handle database connection error here 
        const data = formatData(req);
            
        if (res.locals.response !== undefined) {
            data['response'] = res.locals.response;
            mongoose.connection.emit("error", err.name, data);
        }
        else {
            // error has been thrown before any middleware or route was reached.
            if (res.headersSent === false) {

                const fallback =  {
                    status: err.status || err.code || 400,
                    name: err.name || err.type || "N/A",
                    msg: err.message || err.msg || "Unexpected Error"
                }
                
                res.locals.response = (!err.code || !err.status) ? generateErrorResponse(err) : fallback;
                
                data['err_s'] = {
                    type: res.locals.response.name,
                    msg: res.locals.response.msg,
                    location: 'body'
                };
                console.log(data);
                res.status(res.locals.response.status).json(res.locals.response)
            }
            try {
                // TODO : format special error case here
                await sys_err_model.create(data);
            } catch (e) {
                console.error("logging error entry failed");
                mongoose.connection.emit("error", err.name || err.type, data, true);
            }
            return;
        }
    }
}

module.exports = errorHandler;
