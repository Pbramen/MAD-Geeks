const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customSchema = require('./decoratorSchema.js');

const user_Auth_Schema = new Schema({
    userLogin: {
        type: String,
        unique: true,
        minLength: [6, "Min length of login username must be greater than 6."],
        maxLength: [16, "Max length of login username must be less than 16"],
        required: [true, "Username is required to sign up!"]
    },
    email: {
        type: String,
        unique: true,
        minLength: 6,
        required: ["true", "Email is required to sign up!"]
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
    }
}, {timestamps: true});

const user_Account_Schema = new Schema({
    userAuthId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth'
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

// ======================== MIDDLEWARE FUNCTIONS ================================


const decAuth = new customSchema(user_Auth_Schema);
const validateAuthIndex = decAuth.validateUniqueIndex()
if (validateAuthIndex) {
    validateAuthIndex('userLogin', "Sorry {VALUE} is already taken.");
    validateAuthIndex('email', "{VALUE} is already in use. Please use a different email.");
 }

user_Auth_Schema.path("userLogin").validate(async function (value) {
    const v = await this.constructor.findOne({ userLogin : value })
    if (v)
        return false
    return true
}, "Sorry, {VALUE} is taken. Please try again.");

user_Auth_Schema.path("email").validate(async function (value) {
    const v = await this.constructor.findOne({ email : value })
    if (v)
        return false
    return true
}, "Sorry, {VALUE} is taken. Please try again.");

// logging hook TODO:
user_Auth_Schema.pre('save', function (next) {
    var user = this;
    if (user.isModified("location")) { 
        if (user.location === true) { 
            // record the location! 
            console.log("recording location ...");
        }
        else {
            // remove location from database
            console.log("deleting location from db...");
        }
    }
    next();
})

function checkPassword(value) { 
    //TODO: ADD REGEX FOR SINGLE SPECIAL CHARACTER)S-!!
    return true;
}
function checkIfValidAge(value) { 
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()
    const day = date.getDay()

    var splitValue = value.split("-")
    var validAge = true
    
    if (splitValue.length !== 3) {
        console.log('Invalid user input');
        return false;
    }
    else{
        splitValue = splitValue.map((el)=>{
            return parseInt(el, 10)
        })
        if (year - splitValue[0] < 13)
            validAge = false
        else if (month - splitValue[1] < 0)
            validAge = false
        else if (month - splitValue[1] == 0 && day - splitValue[2] < 0)
            validAge = false
        return validAge;
    }
}


const userModel = mongoose.model("UserAuth", user_Auth_Schema);
const accountModel = mongoose.model("UserAccount", user_Account_Schema);
module.exports = {
    userModel, accountModel
}