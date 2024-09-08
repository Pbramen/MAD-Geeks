
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const err_obj = new Schema({
    type: String,
    value: String,
    msg: {
        type: [String]
    },
    path: String,
    location: String
});

const resposne = new Schema({
    status: String,
    msg: String,
    code: Number,
    roles: {
        type: [String],
        required: false,
    }, 
    accessToken: {
        type: String, 
        required: false
    },
    link: String,
    err_obj: Object
})

// records 100 - 499 status codes
const api_access = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    duration_ms: {
        type: Number
    },
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    protocol:{
        type: String,
        required: true
    },
    response: {
        type: resposne,
        required: false
    },
    user_agent: String,
    version: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    timestamp: Date
})

// Record system errors (usually returns 500+ status codes)
const sys_err = new Schema({
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    protocol:{
        type: String,
        required: true
    },
    src: String,
    status_code: Number,
    err_s: {
        type: [err_obj],
        required: false
    },
    response: {
        type: resposne,
        required: false
    },
    user_agent: String,
    version: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    reqBody: {
        type: Object,
        required: false
    },
    duration: {
        type: Number
    },
}, {timestamps: true})

const sys_err_model = mongoose.model("sys_err", sys_err);
const api_model = mongoose.model("api_access", api_access);
module.exports =  { sys_err_model, api_model }
