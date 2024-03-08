const saltAndHash = require('../enbcrypt.js');
const { userModel, accountModel } = require('../mongoFunctions/schemas/client_Schema.js');
const mongoose = require('mongoose');

require("dotenv").config();

function test1(req, res) { 
    return res.status(200).json({ status: 200 });
}
// creates a new account in userAuth and userAccount in transaction. 
async function createNewUser(req, res) {
    const json = req.body;
    try {
        json.password = await saltAndHash(json.password);
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const user = await userModel.create([{
                userLogin: json.userLogin,
                email: json.email,
                password: json.password,
            }], { session })
            await accountModel.create([{
                displayName: json.userLogin,
                DOB : json.DOB   
            }], { session })
            return user;
        })
        session.endSession();
        console.log("this is correctly running!")
        res.status(200).json({"status": 200, "message": "Sucessful transaction"});
    } catch (e) {
       console.log("something went wrong...");
       res.status(400).json(e);
    }
}

async function isValidAuth(req, res) { 
    var { username, password } = req.body;
    try {
        password = await saltAndHash(password);
    } catch (e) { 
        console.log(e);
    }
    const result = await userModel.findOne({
        and: ([
            { userLogin: username },
            { password: password }
        ], (err, res) => { 
            if (err) {
                console.log(e);
            }
        })
    });    
    //TODO: replace this with jwt token!
    res.status(200).json({"status": "ok"});
}
module.exports = {
    test1, createNewUser, isValidAuth
}
