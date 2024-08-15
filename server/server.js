const path = require("path")
const express = require("express");

const authRouter = require(path.resolve(__dirname, 'src/routers/auth/authModel'));
const singleCharRouter = require(path.resolve(__dirname, 'src/routers/characterSheet/singleCharModel'));
const multipleCharRouter = require(path.resolve(__dirname, 'src/routers/characterSheet/multipleCharModel'));
const cors = require('cors');

const swaggerjsdoc = require("swagger-jsdoc");
const swaggerConfig = require(path.resolve(__dirname, 'src/config/swagger.json'));
const swaggerUI = require("swagger-ui-express");

const cookieParser = require("cookie-parser");
const errorHandler = require(path.resolve(__dirname, "src/middleware/LogErrors" ));

const { mongoose_connect } = require(path.resolve(__dirname, 'src/mongoFunctions/mongoDB.js'));
const { decodeTest } = require(path.resolve(__dirname, 'src/routers/dev/decodeJWT'));
const { logAPIAccess } = require(path.resolve(__dirname, 'src/middleware/logSuccessAPI'));
const saveJSONResponse = require(path.resolve(__dirname, 'src/middleware/saveResponse'));
const {ui_config} = require(path.resolve(__dirname, "src/config/swagger_css"))
require('dotenv').config();

const app = express();

if (process.env.NODE_ENV.trim() === 'development') {
    console.log('------------------ dev cycle --------------------');
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
    },
    customCss: ui_config
}));

// set timer for logging purposes.
app.use( (req, res, next) => {
    res.locals.startTime = Date.now();
    next();
});

app.use(saveJSONResponse);

app.use('/api/clients', authRouter);
app.use('/api/characterSheet', singleCharRouter);
app.use('/api/characterSheets', multipleCharRouter)

app.use('/api/set-cookie', (req, res) => {
    res.setHeader("Set-Cookie", "name=value");
    res.send("You got cookies!");
})

app.get('/decode', decodeTest);
app.use(logAPIAccess);
app.use("*", (req, res) => {
    res.status(404).json({
        status: "NOT_FOUND",
        msg: "Resource does not exist."
    })
})
app.use(errorHandler);
