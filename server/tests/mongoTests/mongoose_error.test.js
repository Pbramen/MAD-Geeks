// var assert = require('assert');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongoose = require("mongoose");
// const { MongoError } = require('mongodb');

// var mongoDB;

// before(async function () {
//     mongoDB = await MongoMemoryServer.create()
// });


// after(async function () {
//     await mongoDB.stop()
// })

// const generateErrorResponse = (err) => {
//     // handle validation errors here...
//     let res_json = {errors: []}

   
//     if (err instanceof mongoose.Error) {
//         // can be validation or cast error
//         if (err instanceof mongoose.Error.ValidationError && err['errors']) {
//             // push all error paths and their messages
//             // convert errors object into an array:
            
//             Object.values(err.errors).forEach((obj, key) => {
//                 if (obj.name === "CastError") {
//                     res_json.errors.push({
//                         path: obj.reason?.path | obj.path | key,
//                         msg: `Expected ${obj.kind}, received ${obj.valueType}`
//                     })
//                 }
//                 else {
//                     console.log(obj.name);
//                     res_json.errors.push({
//                         path: obj.reason?.path | obj.path | key,
//                         msg: obj.message
//                     })
//                 }

//             })
//         }
//     }
//     else if (err instanceof MongoError && err['code'] !== undefined) {
//         // check for duplicate key
//         if (err.code === 1100) {
//             Object.getOwnPropertyNames(err?.keyPattern).forEach((el) => {
//                 res_json.errors.push({
//                     path: el,
//                     msg: `${el} must be unique`,
//                     value: err.keyValue[el]
//                 })
//             })
//         }
//         else if (err.code === 2) {
//             // need to send signal for db overload!
//             res_json.errors.push({
//                 msg: err?.errorResponse.errmsg
//             })
//         }
//         else {
//             // other server related issue here...
//             res_json.errors.push({
//                 status: "DB_ERR",
//                 type: err?.name,
//                 msg: err?.message
//             })
//         }
//     }
//     else {
//         // other unexpected error occured.
//         res_json.errors.push({
//             status: "OTHER_ERR",
//             type: err?.name,
//             msg: err?.message
//         })
//     }
//     return res_json;
// }

// describe("Test error handler for mongoose/mongodb", function () {
//     var userSchema; 
//     var userModel;

//     before(async function () {
//         await mongoose.connect(mongoDB.getUri(), { dbName: "testDB" });
//         userSchema = new mongoose.Schema({
//             username: {
//                 type: String,
//                 minLength: 5,
//                 maxLength: 20,
//                 unique: true,
//                 required: true
//             },
//             password: {
//                 type: String,

//             },
//             uuid: {
//                 type: Number,
//                 required: true
//             }
//         })

//         limitTest = new mongoose.Schema({
//             multTypeError: {
//                 type: Number
//             },
//             largeString: {
//                 type: String,
//                 maxLength: 160000000,
//                 required: true
//             }
//         })

//         limitModel = mongoose.model("limit", limitTest)
//         userModel = mongoose.model("users", userSchema);
//     });


//     after( async function () {
//         await mongoose.disconnect();
//     })

//     it.skip("Generate and detect CastError as Mongoose",  async function () {
//         var errOccured = false;
//         try{
//             const user = new userModel({
//                 username: [{name: 'Test'}],
//                 password: "abcdef",
//                 uuid: ["12ab"]
//             })
//             await user.save();
//         } catch (err) {
//             errOccured = true;
//             assert.ok(err instanceof mongoose.Error.ValidationError);
//             assert.ok(err.errors.uuid['name'] === 'CastError', "Invalid error thrown");
//             assert.ok(Object.entries(generateErrorResponse(err).errors).length === 2, "Invalid reponse");
//         }
//         assert.ok(errOccured, "Error Not thrown");
//     })

//     it.skip("Generate CastError AND ValidationError", async function () {
//         var errOccured = false;
//         try {
//             const user = new userModel({
//                 username: 't',
//                 password: {'a': "a"},
//                 uuid: [123, 123]
//             })
//             await user.save();

//             await userModel.find({ username: 't' }).then((response) => {
//                 console.log(response);
//             })           
//         } catch (err) {
//             errOccured = true;
//             assert.ok(err instanceof mongoose.Error.ValidationError);
//             assert.ok(Object.entries(generateErrorResponse(err).errors).length === 3, "Did not detect all errors");

//         }
//         assert.ok(errOccured, "Error not thrown");
//     })

//     it.skip("Generate Limit Error", async function () {
//         var errOccured = false;
//         try {
//             const newLimit = ('A').repeat(16 * 1024 * 1024);
//             const limit = new limitModel({
//                 largeString: newLimit
//             });
//             await limit.save();

//         } catch (err) {
//             errOccured = true;
//             assert.ok(err instanceof MongoError, "Error not registered by MongoDB");
//             assert.ok(err.code === 2, "Error object is not large enough");
//         }
//         assert.ok(errOccured, "Error not thrown");
//     })

//     // mongoose Validation error takes precedence over mongodb errors
//     it.skip('Generate Large data with additional CastError', async function (){
//         var errOccured = false
//         try {
//             const newLimit = 'A'.repeat(16 * 2024 * 1024);
//             const limit = new limitModel({
//                 largeString: newLimit,
//                 multTypeError: 'string',
//             });
            
//             await limit.save();

//         } catch (err) {
//             errOccured = true
//             console.log(JSON.stringify(err, null, " "));
//         }
//         assert.ok(errOccured, "Error not thrown");
    
//     })

//     it.skip("Generate Duplicate Key error", async function () {
//         try {
//             const user = new userModel({
//                 username: 'dummy_user',
//                 password: "abcdef",
//                 uuid: 1234
//             })
//             const user2 = new userModel({
//                 username: 'dummy_user',
//                 password: "abcdef",
//                 uuid: 1234
//             })

//             await user.save();
//             await user2.save();
//         } catch (e) {
//             assert(e instanceof MongoError, "Not a mongoose Error");
//             assert(e.errorResponse.code === 11000, "Not a duplicate mongodb error");
//             const result = generateErrorResponse(err);
//             assert.strictEqual(result, {'errors': [{'msg': 'object to insert too large. size in bytes: 16777265, max size: 16777216'}]})
//         }
//     })
// })

