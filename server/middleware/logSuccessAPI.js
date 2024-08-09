const mongoose = require('mongoose');
const { api_model } = require('../mongoFunctions/schemas/logging_schema');

const logAPIAccess = async (req, res, next) => {
    // endpoint not found
    if (!req.route) {
        console.log("<------------------------------------>")
        console.log(" Endpoint not found")
        const err = new Error("Attempt to access non-existant endpoint");
        res.status(404).json({
            status: 404,
            msg: "Resource not found."
        });
        next(err);
    }
    setTimeout(async () => {
        if (res.headersSent === false) {
            console.log("this was not sent yet...")
            return res.status(500).json({
                status: "USAGE_ERR",
                msg: "Operation succesful, but no response body was sent.",
                endpoint: req.originalUrl
            })
            //throw new Error("Headers must be sent BEFORE logger")    
        
        }
            
        }, 200)
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