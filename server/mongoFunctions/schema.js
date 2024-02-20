const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = new Schema({
    userName: {
        type: String, 
        maxLength: 16
    },
    role: {
        type: ["user, admin"]
    }
}, { timestamp: true })

module.exports = mongoose.model("user", userModel);