const express = require("express");
const mongoose = require("mongoose");
const router = require('./routers/routerModel');
require("dotenv").config();

const app = express();

app.use('/', (req, res, next) => {
    console.log(req.ip, req.method, req.url, req.protocol, req.httpVersion, req.params)
    next();
})

mongoose.connect(process.env.URI_M)
    .then(() => { 
        app.listen(process.env.PORT, () => {
            console.log(`Sucessfully connected to MongoDB! `)
        })
    })
    .catch((error) => { 
        //TODO: error logging for mongoose
        console.log(error);
    });
app.use('/api/test', router);