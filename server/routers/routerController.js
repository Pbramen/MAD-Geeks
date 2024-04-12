const saltAndHash = require('../enbcrypt.js');
const { userModel, accountModel } = require('../mongoFunctions/schemas/client_Schema.js');
const { createUser } = require("../mongoFunctions/query/postQuery.js");
const { isTaken } = require("../mongoFunctions/query/getQuery.js");

require("dotenv").config();

function test1(req, res) { 
    return res.status(200).json({ status: 200 });
}

/**
 * Creates a new user and auth info
 * @param {Object} req 
 * @param {Object} res 
 * @returns {JSON} Status
 */
async function createNewUser(req, res) {
    const json = req.body;
    var unique = false;
    try {
        unique = await isTaken(json.email, json.userLogin);
        console.log(unique);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
    
    switch (unique) {
        case 0:
            try {
                json.password = await saltAndHash(json.password);
                createUser(json);
                return res.status(200).json({ "status": 200, "message": "Sucessful transaction" });
            } catch (e) {
                console.log(e.message);
                return res.status(400).json(e);
            }
        case -1:
            return res.status(200).json({ "status": "200", "msg": "Username is taken." });
        case -2:
            return res.status(200).json({ "status": "200", "msg": "Email is taken." });
        default:
            return res.status(200).json({ "status": "200", "msg": "Username and email is taken." });
    }
}

async function isValidAuth(req, res) { 
    var { username, password } = req.body;
    try {
        password = await saltAndHash(password);
    } catch (e) { 
        //TODO: LOG HERE
        return res.status(400).json(e);
    }
    const result = await userModel.findOne({
        and: ([
            { userLogin: username },
            { password: password }
        ], (err, res) => { 
            if (err) {
                //TODO: LOG HERE
                return res.status(400).json(err);
            }
        })
    });    
    //TODO: replace this with jwt token!
    console.log('returning ok')
    res.status(200).json({"status": "ok"});
}
module.exports = {
    test1, createNewUser, isValidAuth
}
