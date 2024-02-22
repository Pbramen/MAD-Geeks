const express = require("express");
const mongoose = require("mongoose");
const router = require('./routers/routerModel');
require("dotenv").config();

const app = express();

// access to req.body
app.use(express.json());

app.use('/', (req, res, next) => {
    console.log(req.ip, req.method, req.url, req.protocol, req.httpVersion, req.params)
    
    //TODO: change 
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_SIDE);
    res.setHeader("Access-Control-Allow-Methods", "POST GET DELETE PATCH");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

mongoose.connect(process.env.URI_M)
    .then(() => { 
        app.listen(process.env.PORT, () => {
            console.log(`Sucessfully connected to MongoDB! `);
        })
    })
    .catch((error) => { 
        //TODO: error logging for mongoose
        console.log(error);
    });
app.use('/api/test', router);