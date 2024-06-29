const mongoose = require('mongoose');
const {ExpressValidatorError, InvaildAuthError} = require("../errorHandling/ValidationError");
const { sys_err_model } = require('../mongoFunctions/schemas/logging_schema');
require('dotenv').config();

/**
 * Global error handling for validators ONLY. 
 * (if db error occurs -> mongoose.connection.emit('error') instead)
 */
const errorHandler = async (err, req, res, next) => {

    // error occured during validation state
    if (err instanceof ExpressValidatorError ||
        err instanceof InvaildAuthError) {
        
        const log_entry = sys_err_model(err.getData());
        log_entry.save().then(() => {
                console.log("log successful.")
            }
        ).catch((e) => {
            mongoose.connection.emit("error", e, err.data, true);    
        })
    }
    else {
        console.log("Unhandled error has occured:");
        console.log(err);
        process.exit(-1);
    }
}

module.exports = errorHandler;