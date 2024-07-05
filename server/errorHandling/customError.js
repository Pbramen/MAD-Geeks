const mongoose = require('mongoose');

const generateErrorResponse = (err) => {
    // handle validation errors here...
    let res_json = {status: 500 ,errors: []}
    console.log("generating error resposne...")

    // uncaught mongoose error (fallback)
    if (err instanceof mongoose.Error) {
        // can be validation or cast error
        if (err instanceof mongoose.Error.ValidationError && err['errors']) {
            // push all error paths and their messages
            // convert errors object into an array:
            res_json.status = 406;
            res_json.name = "VS_ERR";
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
    else if (err.code !== undefined && typeof err.code === 'number' ) {
        
        // check for duplicate key
        if (err.code === 11000) {
            res_json.status = 409;
            res_json.name = "DUP_ERR";
            Object.getOwnPropertyNames(err?.keyPattern).forEach((el) => {
                res_json.errors.push({
                    path: el,
                    msg: `${el} must be unique`,
                    value: err.keyValue[el]
                })
            })
        }
        else if (err.code === 2) { 
            res_json = {
                status: 507,
                name: "OUT_OF_MEMORY",
                msg: err?.errorResponse.errmsg
            }
        }
        else {
            // other server related issue here...
            res_json.errors.push({
                status: 503,
                name: err?.name,
                msg: err?.message
            })
        }
    }
    else {
        // other unexpected error occured.
        res_json.errors.push({
            status: 500,
            name: err?.name,
            msg: err?.message
        })
    }
    return res_json;
}


module.exports = {generateErrorResponse}