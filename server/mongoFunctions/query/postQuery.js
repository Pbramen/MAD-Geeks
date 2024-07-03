const rollHistory = require("../schemas/rolls_Schema");
const mongoose = require('mongoose');
const {userModel, accountModel} = require("../schemas/client_Schema");
const { sys_err_model } = require("../schemas/logging_schema");

/**
 * Initializes a new roll_history item 
 *  @param{ObjectID} user_id - ObjectID of the user 
 * config @param{Object} config - meta data about the user { type : string, quantity : number, disadvantage : bool }
 * resutls @param{Object} results - results of the roll { firstRoll: number, secondRoll(optional) : number, bonus: [{string, number}]}
 * @returns{rolls_Schema.roll_history} the newly created instance. 
 */
async function createNewRoll(user_id, config, results) {
    try {
        await doc.create({

        });
    } catch (e) {
        console.log("creation failed");
        console.log(e);
        //log to db here.
        //exit();
    }
    return doc;
}

async function checkDuplicates(json) {
    try {
        const response = await userModel.aggregate([{
            $match: {
                $or: [
                    { userLogin: json.userLogin },
                    { email: json.email }
                ]
            }
        }, { $limit: 2 }
        ])
        const data = []
        // account maybe already registered
        if (response.length === 1) {
            if (json.userLogin === response[0].userLogin) {
                data.push({
                    'path': "username",
                    'value': json.userLogin
                });
            }
            if (json.email === response[0].email) {
                data.push({
                    'path': 'email',
                    'value': json.email
                });
            }
        }
    
        if (response.length === 2) {
            // both responses are guarneeted
            data.push({
                'path': 'userLogin',
                'value': json.userLogin
            });
            data.push({
                'path': 'email',
                'value': json.email
            });
        }

        else if (response.length === 0) {
            return 0;
        }
        return data;
    } catch (e) {
        throw e;
    }
}

async function createUser(json, hashed, role) {
    try {
        const session = await mongoose.startSession({causalConsistency: true});
        await session.withTransaction(async () => {
            const user = new userModel({
                userLogin: json.userLogin,
                email: json.email,
                password: json.password
            })
            
            await user.validate();
            user.password = hashed;
            const a = await user.save({ session , validateBeforeSave : false});
           
            const acct = new accountModel({
                userAuthId: a._id,
                displayName: json.userLogin,
                DOB: json.DOB,
                role: role
            })
        
            await acct.save({session});
        });
        session.endSession();
    } catch (e) {
        throw e;
    }
}

/**
 * callback function used by createUser() to generate atomically userAuth and userAccount.
 * @param {String} hashed - hashed password to insert.
 * @param {JSON} json - JSON containing all user information sent by the login form.
 * @param {Session} session - mongoose session object
 */
async function handleTransaction(json, session, hashed) {
    var err = "";
    const user = new userModel({
        userLogin: json.userLogin,
        email: json.email,
        password: json.password
    })
    
    await user.validate();
    user.password = hashed;
    const a = await user.save({ session , validateBeforeSave : false});
   
    const acct = new accountModel({
        userAuthId: a._id,
        displayName: json.userLogin,
        DOB: json.DOB
    })

    await acct.save({session});
}

module.exports = {
    createNewRoll,
    createUser,
    checkDuplicates
}