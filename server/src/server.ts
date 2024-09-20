import cors from 'cors';
import bodyParser from 'body-parser';

import express from 'express';
import 'dotenv/config'

import './postgress/connection';

import { StatusCode } from './response/ReturnCode';
import { customErrorRoute } from './error/customErrorRoute';
//import { throwInvalidParamError } from './debug/testRoutes.itest';
import './routes/auth/JWT_controller';
import { seq_connection } from './postgress/connection';
const app = express();
const port = 4000;

seq_connection.start_connection().catch((error) => {
    console.error('Unable to start connection: ' + error.message);
    process.exit(-1);
})


app.use((req, res, next) => {
    // test the connection per request:
    seq_connection.start_connection()
        .then(next)
        .catch(next)
})

app.use((req, res) => {
    console.log('passed as expected!');
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/json' }))


app.listen(process.env.PORT, () => {    
    console.log(`Application successfully listening on port ${port}`);
})


app.use((req, res) => {
    if (req.body) {
        console.log(req.body);
    }
    
    if (!res.headersSent) {
        return res.status(404).json(
            {
                status: StatusCode.NOT_FOUND,
                msg: "Sorry, the endpoint you are looking for is in another castle!"
            }
        )
    }
    else
        console.log("Headers already sent!");
})

app.use(customErrorRoute)