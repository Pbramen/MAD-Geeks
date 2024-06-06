const express = require("express");
const mongoose = require("mongoose");
const authRouter = require('./routers/auth/authModel.js');
const sheetRouter = require('./routers/characterSheet/characterModel.js');
require("dotenv").config();
const app = express();

// access to req.body json
app.use(express.json());

// allow ONLY client to access 
app.use('/', (req, res, next) => {
    console.log(req.method, req.url, req.protocol, req.httpVersion, req.body)
    //TODO: change 
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); 
    // preflight -> need to accept req-method, Origin, req-headers
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    // options is used in preflight 
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    next();
})
mongoose.connect(process.env.URI_M)
    .then(() => { 
    app.listen(process.env.PORT, () => { 
        console.log(`Sucessfully listining on port ${process.env.PORT}`);
    })
})
app.use('/api/clients', authRouter);
app.use('/api/sheet', sheetRouter);
app.use('/api/set-cookie', (req, res) => {
    res.setHeader("Set-Cookie", "name=value");
    res.send("You got cookies!");
})