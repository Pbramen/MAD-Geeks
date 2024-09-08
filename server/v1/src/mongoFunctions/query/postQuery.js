const path = require("path")
const rollHistory = require(path.resolve(__dirname,"../schemas/rolls_Schema"));
const mongoose = require('mongoose');
const {userModel, accountModel} = require(path.resolve(__dirname, "../schemas/client_Schema"));

/**
 * Initializes a new roll_history item 
 *  @param{ObjectID} user_id - ObjectID of the user 
 * config @param{Object} config - meta data about the user { type : string, quantity : number, disadvantage : bool }
 * resutls @param{Object} results - results of the roll { firstRoll: number, secondRoll(optional) : number, bonus: [{string, number}]}
 * @returns{rolls_Schema.roll_history} the newly created instance. 
 */
async function createNewRoll(user_id, config, results) {
    try {
        await doc.create({});
    } catch (e) {
        console.log("creation failed");
        console.log(e);
        //log to db here.
        //exit();
    }
    return doc;
}

async function checkDuplicates(json) {
    console.log("checking for duplicates...")
    try {
        console.log(json.username);
        const response = await userModel.aggregate([{
            $match: {
                $or: [
                    { userLogin: json.username },
                    { email: json.email }
                ]
            }
        }, { $limit: 2 }
        ])
        const data = []
        // account maybe already registered
        if (response.length === 1) {
            if (json.username === response[0].userLogin) {
                data.push({
                    'path': "username",
                    'value': json.username
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
                'value': json.username
            });
            data.push({
                'path': 'email',
                'value': json.email
            });
        }

        else if (response.length === 0) {
            return 0;
        }
        
        return {
            status: "DUP_ERR",
            msg: "Username/email is already taken.",
            err_obj: data
        };

    } catch (e) {
        console.error(e.name);
        throw e;
    }
}

async function createUser(json, hashed, role) {
    try {
        const session = await mongoose.startSession({causalConsistency: true});
        await session.withTransaction(async () => {
            const user = new userModel({
                userLogin: json.username,
                email: json.email,
                password: json.password
            })
            
            await user.validate();
            user.password = hashed;
            const a = await user.save({ session , validateBeforeSave : false});
           
            const acct = new accountModel({
                userAuthId: a._id,
                displayName: json.username,
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

module.exports = {
    createNewRoll,
    createUser,
    checkDuplicates
}