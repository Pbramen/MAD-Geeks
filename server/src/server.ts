import cors from 'cors';
import bodyParser from 'body-parser';

import express from 'express';
import 'dotenv/config'

import { seq_connection } from './postgress/connection';

import { StatusCode } from './response/ReturnCode';
import { customErrorRoute } from './error/customErrorRoute';

import './middleware/routes/auth/JWT_controller';
import { router as userRoutes } from './middleware/routes/auth/user_model';
import { failedResponse } from './middleware/standardizeJSONResposne';

const app = express();
const port = 4000;

seq_connection.start_connection().catch((error) => {
    console.error('Unable to start connection: ' + error.message);
    process.exit(-1);
})


app.use((_, __, next) => {
    // test the connection per request:
    seq_connection.start_connection()
        .then(next)
        .catch(next)
})

app.use((req, res, next) => {
    console.log('\tcalling endpoint: ', req.originalUrl)
    next();
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/json' }))


app.listen(process.env.PORT, () => {    
    console.log(`Application successfully listening on port ${port}`);
})

app.use('/user', userRoutes);

app.use((req, res, next) => {
    if (!res.headersSent) {
        return failedResponse({
            res: res,
            code: StatusCode.NOT_FOUND,
            status: 'Invalid Endpoint',
            message: 'Sorry, the endpoint you are looking for is in another castle!',
            descript: 'INVALID_ENDPOINT_ACCESS'
        });
    }
    else {
        if (!res.locals.descript) {            
            return next(new Error("You Must set res.locals.descript for logging purposes"));
        }
        // log data here... 
        const json = {
            method: req.method,
            protocol: req.protocol,
            httpVersion: req.httpVersion,
            endpoint: req.originalUrl,
            origin: req.baseUrl || 'none',
            body: req.body || 'N/A',
            status: req.statusCode || 200,
            action: res.locals.action_taken
        }
        //console.log("Headers have been sent!", JSON.stringify(json, null, 3));
    }
        
})

app.use(customErrorRoute)