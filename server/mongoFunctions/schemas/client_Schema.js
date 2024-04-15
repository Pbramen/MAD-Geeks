const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { checkIfValidAge, checkPassword, isAlphaNumeric, checkEmail } = require("../validators/validateFunctions.js");

const user_Auth_Schema = new Schema({
    userLogin: {
        type: String,
        unique: true,
        minLength: [6, "Min length of login username must be greater than 8."],
        maxLength: [16, "Max length of login username must be less than 16"],
        required: [true, "Username is required to sign up!"],
        validator: [isAlphaNumeric, "Username must be alpha-numeric. No symbols allowed."]
    },
    email: {
        type: String,
        unique: true,
        minLength: [6, "Email length must be greater than 6 characters."],
        required: ["true", "Email is required to sign up!"],
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        validate: checkPassword,
        minLength: [8, "Password must be at least 8 characters long."]
    },
    tempPassword: {
        type: String,
        maxLength: 8
    }, 
    activity: {
        active: {
            type: Boolean,
            default: true
        },
        last_login: {
            type: Date,
            default: Date.now()
        }
    }
}, {timestamps: true});

const user_Account_Schema = new Schema({
    userAuthId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    displayName: {
        type: String,
        required: true,
        minLength: [6, "Min length of login username must be greater than 6."],
        maxLength: [16, "Max length of login username must be less than 16"],
        validate: [isAlphaNumeric, "Display name must be alphanumeric."]
    },
    role: [{
        id: { type: String },
        rel: { type: mongoose.Schema.Types.ObjectId }
    }],
    DOB: {
        type: String,
        validate: {
            validator: checkIfValidAge,
            message: "You must be above the age of 13 to be able to register."
        },
        required: true
    },
    location: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})
user_Account_Schema.index({ userAuthId: 1, displayName: 1 })

const role_Schema = new Schema({
    name: {
        type: String, 
        required: true
    }
})



const userModel = mongoose.model("UserAuth", user_Auth_Schema);
const accountModel = mongoose.model("UserAccount", user_Account_Schema);

module.exports = {
    userModel, accountModel
}