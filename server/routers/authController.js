const saltAndHash = require('../enbcrypt.js');
const { userModel } = require('../mongoFunctions/schemas/client_Schema.js');
const { createUser } = require("../mongoFunctions/query/postQuery.js");
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
    try {
        let hashed = await saltAndHash(json.password);
        await createUser(json, hashed);
        let result = {"msg": `${json.userLogin} successfully created!`}
        return res.status(200).json(result); 
    } catch (e) {
        const err = handleError(e);
        return res.status(400).json(err);
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


const handleError = (error) => {
    var err = {errors: []};
    if (error.hasOwnProperty('errors')) {
        Object.values(error.errors).forEach((el) => {
            let props = el.properties;
            err.errors.push(
                {
                    path: props.path,
                    message: props.message,
                    type: props.type,
                    value: props.value
                }
            )
            console.log(props);
        });
    
        return err;
    }
    // duplicate key found
    else if (error.hasOwnProperty('code') && error.code == 11000) {
        if (error.hasOwnProperty("keyPattern") && error.hasOwnProperty("keyValue")) {
            Object.getOwnPropertyNames(error.keyPattern).forEach((el) => {
                err.errors.push({
                    path: el,
                    message: `${el} must be unique.`,
                    value: error.keyValue[el]
                })
            })
        }
        return err;
    }

    return error;
}

module.exports = {
    test1, createNewUser, isValidAuth
}
