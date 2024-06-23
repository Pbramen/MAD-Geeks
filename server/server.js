const express = require("express");
const mongoose = require("mongoose");
const authRouter = require('./routers/auth/authModel.js');
const sheetRouter = require('./routers/characterSheet/characterModel.js');
const cors = require('cors');
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerConfig = require("./config/swagger.json");
const swaggerUI = require("swagger-ui-express");

const logout = require('./routers/auth/logoutController.js')
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/logAccess.js");
require("dotenv").config();
const app = express();


// access to req.body json
app.use(express.json());

app.use(cookieParser());

const options = {
    origin: process.env.CLIENT_SIDE,
    credentials: true,
    methods: ['GET', 'POST', 'PUT']
}

app.use(cors(options));

mongoose.connect(process.env.URI_M)
    .then(() => { 
    app.listen(process.env.PORT, () => { 
        console.log(`Sucessfully listining on port ${process.env.PORT}`);
    })
})


const swg = swaggerjsdoc(swaggerConfig);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swg, {
    swaggerOptions: {
        requestCredentials: 'include'
    }
}));

app.use('/api/clients', authRouter);
app.use('/api/sheet', sheetRouter);
app.use('/api/set-cookie', (req, res) => {
    res.setHeader("Set-Cookie", "name=value");
    res.send("You got cookies!");
})

app.get('/error', (req, res) => {
    throw new Error("Broken");
})
app.use(errorHandler);