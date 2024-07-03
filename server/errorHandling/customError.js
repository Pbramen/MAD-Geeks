const mongoose = require('mongoose');
const { MongoError } = require("mongodb");

const generateErrorResponse = (err) => {
    // handle validation errors here...
    let res_json = {status: 500 ,errors: []}
    
    if (err instanceof mongoose.Error) {
        // can be validation or cast error
        if (err instanceof mongoose.Error.ValidationError && err['errors']) {
            // push all error paths and their messages
            // convert errors object into an array:
            res_json.status = 406;

            Object.values(err.errors).forEach((obj, key) => {
                if (obj.name === "CastError") {
                    res_json.errors.push({
                        path: obj.reason?.path | obj.path | key,
                        msg: `Expected ${obj.kind}, received ${obj.valueType}`
                    })
                }
                else {
                    console.log(obj.name);
                    res_json.errors.push({
                        path: obj.reason?.path | obj.path | key,
                        msg: obj.message
                    })
                }

            })
        }
    }
    else if (err['code'] !== undefined) {
        // check for duplicate key
        if (err.code === 11000) {
            res_json.status = 409;
            Object.getOwnPropertyNames(err?.keyPattern).forEach((el) => {
                res_json.errors.push({
                    path: el,
                    msg: `${el} must be unique`,
                    value: err.keyValue[el]
                })
            })
        }
        else if (err.code === 2) { 
            res_json.status = 507
            // need to send signal for db overload!
            res_json.errors.push({
                msg: err?.errorResponse.errmsg
            })
        }
        else {
            // other server related issue here...
            res_json.errors.push({
                status: "DB_ERR",
                type: err?.name,
                msg: err?.message
            })
        }
    }
    else {
        // other unexpected error occured.
        res_json.errors.push({
            status: "OTHER_ERR",
            type: err?.name,
            msg: err?.message
        })
    }
    return res_json;
}

/**
 * 
 * @param {Object} err - Response generated from generateErrorResponse 
 * @param {String} user - userID (if applicable) 
 * @returns 
 */
const setContext = (err, user = null) => {
    const data = {err: err}
    if (user !== undefined) {
        data['user'] = user
    }
    return data;
}

module.exports = {generateErrorResponse, setContext}