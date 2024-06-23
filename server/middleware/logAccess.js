const mongoose = require('mongoose');
const {sys_err_model} = require("../mongoFunctions/schemas/logging_schema");
//const { ValidationError, PropertyNullError, PropertyNullError } = require('../errorHandling/ValidationError');
const { MongoError } = require('mongodb');
const mongooseError = require('mongoose').Error;
require('dotenv').config();
/**
 * Centralized error handling. 
 * Does NOT return a response (Must be handled in actual route)
 */
const errorHandler = async (err, req, res, next) => {
    console.log("Inside custom error handler...")
    // handle mongodb errors
    if (err instanceof MongoError) {
        try {
            console.log(err.cause);
        }
        catch (e) {
            console.log(e);
            // log to file instead...
        }
    }
    // handle mongoose errors here..
    else if (err instanceof mongooseError.MongooseError) {
        console.log(err);
    }

    else {
        switch (err.constructor) {
            case "ValidationError":
                console.log("Validation error found");
                break;
            case 'PropertyNullError':
                console.log("Property Null Error");
                break;
            case 'PropertyTypeError':
                console.log("Property Type Error");
                break;
            default:
                console.log(err.constructor);
                break;
        }
    }
}

const handleMongoError = (err, req) => {
    const code = err.code;
    const obj = {};

    switch (code) {
        case 11000:
            obj = {
                status: 11000,
                type: "Duplicate key",
                msg: err.message,
                stack: err.stack
            }
            break;

    }

    obj['source'] = err.name;
}


module.exports = errorHandler;