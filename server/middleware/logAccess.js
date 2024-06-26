const mongoose = require('mongoose');
const {sys_err_model} = require("../mongoFunctions/schemas/logging_schema");
const { MongoError } = require('mongodb');
const mongooseError = require('mongoose').Error;
const ExpressValidatorError = require("../errorHandling/ValidationError");
require('dotenv').config();
/**
 * Centralized error handling. 
 * Does NOT return a response (Must be handled in actual route)
 */
const errorHandler = async (err, req, res, next) => {
    const data = {
        endpoint: req.originalUrl,
        method: req.method,
        protocol: req.protocol,
        err_s: err.data?.errors,
        version: process.env.VERSION,
        origin: req.hostname,
        status_code: req.statusCode
    };

    
    if (err instanceof MongoError || err instanceof mongooseError) {
        // propogate the error to event listener.
        mongoose.connection.emit('error', err, data, skip = true);
    }
    else if (err instanceof ExpressValidatorError) {
        const sys_err = new sys_err_model(data)
        try {
            await sys_err.save()
        } catch (err) {
            // forced propropgation
            mongoose.connection.emit('error', err, data);
        }

    }
}

module.exports = errorHandler;