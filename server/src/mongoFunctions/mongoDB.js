const { mongoose } = require("mongoose");
const path = require('path')
const { logError } = require(path.resolve(__dirname, './textLogger'));
require('dotenv').config();
const { sys_err_model } = require(path.resolve(__dirname, './schemas/logging_schema'));
mongoose.connection.on("connected", () => {})
const {EventEmitter} = require('events');

const events = new EventEmitter();
events.setMaxListeners(15);


const errHandler = (err, data, skip=false) => {
    if (!skip && mongoose.connection.readyState === 1) {
        try {   
            const log =  sys_err_model(data);
            log.save();
            console.log("Data being saved.")
        } catch (e) {
            logError(data, err)       
        }
    }
    else {
        logError(data, err);
    }
}


/**
 * Function to handle mongo connection.
 * 
 */
function mongoose_connect(){
    mongoose.connect(process.env.URI_M)
    .then(() => {
        // setTimeout(() => {
        //     mongoose.connection.close();
        //     console.log(mongoose.connection.readyState);
        // }, 2 * 1000)

        // set up all event listeners....
        mongoose.connection.on('error', errHandler)
        

        // function isEventListenerRegistered(emitter, eventName, listener) {
        //     const eventListeners = emitter.listeners(eventName);
        //     return eventListeners.includes(listener);
        // }
        
        // console.log("event error is listening: ", isEventListenerRegistered(mongoose.connection, "error", errHandler))

    })
    .catch((err) => {
        console.log("mongodb connection failed: ", err);
        //process.exit(-1);
    })
}

// do not call on SIGINT  
const mongoose_close = () => {
    mongoose.connection.close().catch((err)=>{
        mongoose.connection.emit('err', err);}
    );
}

// gracefully close db connection on interrupt.
process.on('SIGINT', () => {
    console.log("\n---    PROCESS INTERUPTED      ---");
    if (mongoose.connection.readyState === 1) {
        console.log("attempting to close mongoose connection...");
        try {
            // events.eventNames().forEach((eventName) => {
            //     events.removeAllListeners(eventName);
            // })
            // console.log("removed all Node events...");
            
            mongoose.connection.removeListener("error", errHandler);
            console.log("Removed mongoose events...")
            mongoose.connection.close();
            console.log("Gracefully exited mongoDB");
            process.exit(0);
        } catch (e) {
            console.log(e)
            process.exit(-1);
        }
    }
    else {
        console.log("No connection open. Gracefully exited");
        process.exit(0);
    }
})


module.exports = {mongoose_connect, mongoose_close};