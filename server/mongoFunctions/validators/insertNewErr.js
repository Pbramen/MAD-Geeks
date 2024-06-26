const { sys_err_model } = require("../mongoFunctions/schemas/logging_schema");
require("dotenv").config();

/**
 * Helper function to insert a new error into 
 * @param {Object} err - Err object thrown.
 * @param {Object} req - req object from express 
 */
const insertNewErr = (err, src, req) => {
    try {
        const sys_obj = new sys_err_model({
        "endpoint": req.originalUrl,
        "method": req.method,
        "payload": req.json,
            "err_s": {
                'src': src,
                'err_s': err
        },
        "version": process.env.VERSION,
        "origin": req.hostname
        })
        sys_obj.save();
    }
    catch (e) {
        // TODO: log error to file
        // throw error 
        console.log(e);
    }
}

module.exports(insert)