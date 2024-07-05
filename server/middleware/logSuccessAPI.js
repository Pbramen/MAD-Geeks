const mongoose = require('mongoose');
const { api_model } = require('../mongoFunctions/schemas/logging_schema');

const logAPIAccess = async (req, res) => {
    
    if (res.headersSent === false) {
        throw new Error("Headers must be sent BEFORE logger")    
    }

    const data = {
        duration: Date.now() - res.locals.startTime,
        endpoint: req.originalUrl,
        method: req.method,
        protocol: req.protocol,
        version: process.env.VERSION,
        origin: req.hostname
    }
    
    if (res.locals?.response) {
        data.response = res.locals.response;
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