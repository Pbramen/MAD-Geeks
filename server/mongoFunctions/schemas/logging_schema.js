const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// records 100 - 499 status codes
const api_access = new Schema({
    protocol: String,
    user_agent: String,
    method: String,
    endpoint: String,
    status: Number,
    req_headers: {
        type: Object
    },
    user: {
        _id: mongoose.SchemaTypes.ObjectId,
        roles: [],
    },
    duration_ms: {
        type: Number
    },
    timestamp: Date
})

const err_obj = new Schema({
    type: String,
    value: String,
    msg: String, 
    path: String,
    location: String,
    err_code: Number
});


// Record system errors (usually returns 500+ status codes)
const sys_err = new Schema({
    endpoint: String,
    method: String,
    protocol: String,
    src: String,
    status_code: Number,
    err_s: [err_obj],
    action: String, 
    user_agent: String,
    version: String,
    origin: String
}, {timestamps: true})

const sys_err_model = mongoose.model("sys_err", sys_err);

module.exports =  { sys_err_model }
