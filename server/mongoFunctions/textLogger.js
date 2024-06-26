const {fs, access, constants} = require('node:fs')
const {format, transports, createLogger} = require("winston");
require('winston-daily-rotate-file');
const path = require("path")
const { combine, timestamp, prettyPrint } = format;

const logDirectory = path.resolve(__dirname, '../logs');
console.log(logDirectory);

// winston for rotational error log in local directory ( when database is not working for logging )
// will log both original error and reason mongodb could not record the error log!
var transport = new transports.DailyRotateFile({
    level: 'info',
    filename: 'err-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '10mb',
    maxFiles: '30d',
    dirname: logDirectory
})

transport.on('error', (err) => {
    console.log(err);
})

var logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        transport,
        new transports.Console()
    ]
});

console.log("set up complete");

const logError = (data, dbERR) => {
    access(logDirectory, constants.R_OK | constants.W_OK, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Node has access to ${logDirectory} directory`)
        }
    })

    logger.log({
        level: 'error',
        err_payload: JSON.stringify(data),
        database_err: dbERR
    })
}

module.exports = {logError}