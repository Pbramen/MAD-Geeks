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

const error = new Schema({
    source: String,
    status: Number,
    type: String,
    msg: String,
    location: {
        stack: String, 
        line: Number
    },
    stack_trace: [String]
})

// Record system errors (usually returns 500+ status codes)
const sys_err = new Schema({
    endpoint: String,
    method: String,
    protocol: String,
    payload: Object,
    err: error,
    action: String, 
    user_agent: String,
    version: String,
    origin: String
}, {timestamps: true})

const sys_err_model = mongoose.model("sys_err", sys_err);

module.exports =  { sys_err_model }
