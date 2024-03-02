const express = require("express");
const mongoose = require("mongoose");
const router = require('./routers/routerModel');
require("dotenv").config();
const app = express();

// access to req.body json
app.use(express.json());

// allow ONLY client to access 
app.use('/', (req, res, next) => {
    console.log(req.method, req.url, req.protocol, req.httpVersion, req.body)
    
    //TODO: change 
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_SIDE);
    res.setHeader("Access-Control-Allow-Methods", "POST GET DELETE PATCH");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})
mongoose.connect(process.env.URI_M)
    .then(() => { 
    app.listen(process.env.PORT, () => { 
        console.log(`Sucessfully listining on port ${process.env.PORT}`);
    })
})
app.use('/api/clients', router);

