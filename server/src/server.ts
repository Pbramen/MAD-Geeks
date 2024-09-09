import cors from 'cors';
import bodyParser from 'body-parser';

import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'

import { StatusCode } from './ReturnCodes/ReturnCode';
import { customErrorRoute } from './error/customErrorRoute'
//import { throwInvalidParamError } from './debug/testRoutes.itest';

const app = express();
const port = 4000;

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
    return res.status(404).json(
        {
            status: StatusCode.NOT_FOUND,
            msg: "Sorry, the endpoint you are looking for is in another castle!"
        }
    )
})

app.use(customErrorRoute)