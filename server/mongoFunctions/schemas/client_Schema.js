const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { checkIfValidAge, checkPassword, checkUsername } = require("../validators/validateFunctions.js");

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
        validate: {
            validator: checkPassword,
            message: "Password must include at least one special character."
        },
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
        maxLength: [16, "Max length of login username must be less than 16"]
    },
    role: {
        type: String,
        enum: ["end_user", "webAdmin", "sysAdmin", "moderator"],
        default: "end_user"
    },
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

const userModel = mongoose.model("UserAuth", user_Auth_Schema);
const accountModel = mongoose.model("UserAccount", user_Account_Schema);

module.exports = {
    userModel, accountModel
}