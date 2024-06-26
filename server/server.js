const express = require("express");
const authRouter = require('./routers/auth/authModel.js');
const sheetRouter = require('./routers/characterSheet/characterModel.js');
const cors = require('cors');

const swaggerjsdoc = require("swagger-jsdoc");
const swaggerConfig = require("./config/swagger.json");
const swaggerUI = require("swagger-ui-express");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/logAccess.js");

const { mongoose_connect } = require('./mongoFunctions/mongoDB.js');
const { decodeTest } = require("./routers/dev/decodeJWT.js");
require('dotenv').config();


const app = express();

if (process.env.NODE_ENV === 'development') {
    console.log('dev cycle');

}


// access to req.body json
app.use(express.json());

app.use(cookieParser());

const options = {
    origin: process.env.CLIENT_SIDE,
    credentials: true,
    methods: ['GET', 'POST', 'PUT']
}

app.use(cors(options));

mongoose_connect();
app.listen(process.env.PORT, () => {
    console.log("Node.js backend env listening on port ", process.env.PORT);

});


const swg = swaggerjsdoc(swaggerConfig);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swg, {
    swaggerOptions: {
        requestCredentials: 'include'
    }
}));

// set timer for logging purposes.
app.all('*', (req, res, next) => {
    res.locals.startTime = Date.now();
    next();
});

app.use('/api/clients', authRouter);
app.use('/api/sheet', sheetRouter);
app.use('/api/set-cookie', (req, res) => {
    res.setHeader("Set-Cookie", "name=value");
    res.send("You got cookies!");
})

app.get('/decode', decodeTest);
app.use(errorHandler);
