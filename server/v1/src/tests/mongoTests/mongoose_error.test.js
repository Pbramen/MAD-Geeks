var assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require("mongoose");
const { MongoError } = require('mongodb');
const path = require('path')
const { checkIfValidAge, checkPassword, isAlphaNumeric, checkEmail } = require(path.resolve(__dirname, '../validators/validateFunctions.js'));

var mongoDB;
var userModel;
var accountModel;

before(async function () {
    mongoDB = await MongoMemoryServer.create()
    // setting up auth schema.
    const user_Auth_Schema = new Schema({
        userLogin: {
            type: String,
            unique: true,
            trim: true,
            minLength: [6, "Min length of login username must be greater than 6."],
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
            validate: [isAlphaNumeric, "Display name must be alphanumeric."]
        },
        role: {
            type: [Number],
            required: true,
            enum: [100, 2000, 3000],
            default: [100]
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
    
    }, { timestamps: true })
    
    user_Account_Schema.index({ userAuthId: 1, displayName: 1 })
    userModel = mongoose.model("UserAuth", user_Auth_Schema);
    accountModel = mongoose.model("UserAccount", user_Account_Schema);

    Object.freeze(userModel);
    Object.freeze(accountModel);
});


after(async function () {
    await mongoDB.stop()
})

const generateErrorResponse = (err) => {
    // handle validation errors here...
    let res_json = {errors: []}

   
    if (err instanceof mongoose.Error) {
        // can be validation or cast error
        if (err instanceof mongoose.Error.ValidationError && err['errors']) {
            // push all error paths and their messages
            // convert errors object into an array:
            
            Object.values(err.errors).forEach((obj, key) => {
                if (obj.name === "CastError") {
                    res_json.errors.push({
                        path: obj.reason?.path | obj.path | key,
                        msg: `Expected ${obj.kind}, received ${obj.valueType}`
                    })
                }
                else {
                    console.log(obj.name);
                    res_json.errors.push({
                        path: obj.reason?.path | obj.path | key,
                        msg: obj.message
                    })
                }

            })
        }
    }
    else if (err instanceof MongoError && err['code'] !== undefined) {
        // check for duplicate key
        if (err.code === 1100) {
            Object.getOwnPropertyNames(err?.keyPattern).forEach((el) => {
                res_json.errors.push({
                    path: el,
                    msg: `${el} must be unique`,
                    value: err.keyValue[el]
                })
            })
        }
        else if (err.code === 2) {
            // need to send signal for db overload!
            res_json.errors.push({
                msg: err?.errorResponse.errmsg
            })
        }
        else {
            // other server related issue here...
            res_json.errors.push({
                status: "DB_ERR",
                type: err?.name,
                msg: err?.message
            })
        }
    }
    else {
        // other unexpected error occured.
        res_json.errors.push({
            status: "OTHER_ERR",
            type: err?.name,
            msg: err?.message
        })
    }
    return res_json;
}

describe.skip("Test error handler for mongoose/mongodb", function () {
    var userSchema; 
    var userModel;

    before(async function () {
        await mongoose.connect(mongoDB.getUri(), { dbName: "testDB" });
        userSchema = new mongoose.Schema({
            username: {
                type: String,
                minLength: 5,
                maxLength: 20,
                unique: true,
                required: true
            },
            password: {
                type: String,

            },
            uuid: {
                type: Number,
                required: true
            }
        })

        limitTest = new mongoose.Schema({
            multTypeError: {
                type: Number
            },
            largeString: {
                type: String,
                maxLength: 160000000,
                required: true
            }
        })

        limitModel = mongoose.model("limit", limitTest)
        userModel = mongoose.model("users", userSchema);
    });


    after( async function () {
        await mongoose.disconnect();
    })

    it.skip("Generate and detect CastError as Mongoose",  async function () {
        var errOccured = false;
        try{
            const user = new userModel({
                username: [{name: 'Test'}],
                password: "abcdef",
                uuid: ["12ab"]
            })
            await user.save();
        } catch (err) {
            errOccured = true;
            assert.ok(err instanceof mongoose.Error.ValidationError);
            assert.ok(err.errors.uuid['name'] === 'CastError', "Invalid error thrown");
            assert.ok(Object.entries(generateErrorResponse(err).errors).length === 2, "Invalid reponse");
        }
        assert.ok(errOccured, "Error Not thrown");
    })

    it.skip("Generate CastError AND ValidationError", async function () {
        var errOccured = false;
        try {
            const user = new userModel({
                username: 't',
                password: {'a': "a"},
                uuid: [123, 123]
            })
            await user.save();

            await userModel.find({ username: 't' }).then((response) => {
                console.log(response);
            })           
        } catch (err) {
            errOccured = true;
            assert.ok(err instanceof mongoose.Error.ValidationError);
            assert.ok(Object.entries(generateErrorResponse(err).errors).length === 3, "Did not detect all errors");

        }
        assert.ok(errOccured, "Error not thrown");
    })

    it.skip("Generate Limit Error", async function () {
        var errOccured = false;
        try {
            const newLimit = ('A').repeat(16 * 1024 * 1024);
            const limit = new limitModel({
                largeString: newLimit
            });
            await limit.save();

        } catch (err) {
            errOccured = true;
            assert.ok(err instanceof MongoError, "Error not registered by MongoDB");
            assert.ok(err.code === 2, "Error object is not large enough");
        }
        assert.ok(errOccured, "Error not thrown");
    })

    // mongoose Validation error takes precedence over mongodb errors
    it.skip('Generate Large data with additional CastError', async function (){
        var errOccured = false
        try {
            const newLimit = 'A'.repeat(16 * 2024 * 1024);
            const limit = new limitModel({
                largeString: newLimit,
                multTypeError: 'string',
            });
            
            await limit.save();

        } catch (err) {
            errOccured = true
            console.log(JSON.stringify(err, null, " "));
        }
        assert.ok(errOccured, "Error not thrown");
    
    })

    it.skip("Generate Duplicate Key error", async function () {
        try {
            const user = new userModel({
                username: 'dummy_user',
                password: "abcdef",
                uuid: 1234
            })
            const user2 = new userModel({
                username: 'dummy_user',
                password: "abcdef",
                uuid: 1234
            })

            await user.save();
            await user2.save();
        } catch (e) {
            assert(e instanceof MongoError, "Not a mongoose Error");
            assert(e.errorResponse.code === 11000, "Not a duplicate mongodb error");
            const result = generateErrorResponse(err);
            assert.strictEqual(result, {'errors': [{'msg': 'object to insert too large. size in bytes: 16777265, max size: 16777216'}]})
        }
    })
})

