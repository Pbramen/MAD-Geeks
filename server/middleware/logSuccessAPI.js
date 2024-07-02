const mongoose = require('mongoose');
const { api_model } = require('../mongoFunctions/schemas/logging_schema');
const { ExpressValidatorError, InvaildAuthError, MongoDuplicateError} = require('../errorHandling/ValidationError');

const logAPIAccess = async (req, res, err_s = null, response = null) => {
    const data = {
        duration: Date.now() - res.locals.startTime,
        endpoint: req.originalUrl,
        method: req.method,
        protocol: req.protocol,
        version: process.env.VERSION,
        origin: req.hostname
    }
    if (err_s) {
        data.err_s = err_s;
    }
    if (response) {
        data.response = response;
    }
    if (res.locals?.user) {
        data.user = res.locals.user;
    }
    
    try {
        await api_model.create(data);
    } catch (e) {
        // emit error here...
        console.log(e);
        mongoose.connection.emit('error', e, data, true);
    }
}

module.exports = {logAPIAccess}