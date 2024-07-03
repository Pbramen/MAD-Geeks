var assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require("mongoose");
const { setUpForAPI } = require("./mongoSetServer.stub");

var mongoDB;

before(async function () {
    //mongoDB = await MongoMemoryServer.create()
});


after(async function () {
    //await mongoDB.stop()
})

describe("Test no mongoDB connection response", function () {
    
    var user_model;
    before(async function () {
        mongoDB = await MongoMemoryServer.create();
        const Schema = mongoose.Schema;
        await mongoose.connect(mongoDB.getUri(), { dbName: "testDB" });
    
        const user_Auth_Schema = new Schema({
            userLogin: {
                type: String,
                unique: true,
                trim: true,
                minLength: [6, "Min length of login username must be greater than 6."],
                maxLength: [16, "Max length of login username must be less than 16"],
                required: [true, "Username is required to sign up!"]
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
            },
            refreshToken: String
        }, {timestamps: true});
    
        const user_Account_Schema = new Schema({
            userAuthId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            displayName: {
                type: String,
                trim: true,
                required: true,
                minLength: [6, "Min length of login username must be greater than 6."],
                maxLength: [16, "Max length of login username must be less than 16"],
            },
            role: {
                type: [Number],
                required: true,
                enum: [100, 2000, 3000],
                default: [100]
            },
            DOB: {
                type: String,
                required: true
            },
            location: { 
                type: Boolean,
                default: false
            },
            banned: {
                value: {
                    type: Boolean,
                    default: false
                },
                reason: {
                    type: String, 
                    maxLength: 256
                },
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
    
        }, {timestamps: true})
        user_Account_Schema.index({ userAuthId: 1, displayName: 1 })

        user_model = mongoose.model("UserAuth", user_Auth_Schema);
        await mongoose.connection.close();
    })

    after(async function () {
        
    })

    it("Testing user registration endpoint", async function () {
        var err_Occured = false;
        try {
            await user_model.create({
                userLogin: 'usernameTest',
                password: "1!passWord1",
                email: 'testing@gmail.com',
                DOB: '1990-01-01'
            })
        } catch (e) {
            err_Occured = true;
            console.log(e);
        }
        assert.ok(err_Occured, "Failed to generate connection error")
    })
})