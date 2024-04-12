const rollHistory = require("../schemas/rolls_Schema");
const mongoose = require('mongoose');
const {userModel, accountModel} = require("../schemas/client_Schema");


/**
 * Initializes a new roll_history item 
 *  @param{ObjectID} user_id - ObjectID of the user 
 * config @param{Object} config - meta data about the user { type : string, quantity : number, disadvantage : bool }
 * resutls @param{Object} results - results of the roll { firstRoll: number, secondRoll(optional) : number, bonus: [{string, number}]}
 * @returns{rolls_Schema.roll_history} the newly created instance. 
 */
async function createNewRoll(user_id, config, results) {
    const doc = new rollHistory({
        user_id: user_id,
        config: config,
        results: results
    });
    try {
        await doc.save();
    } catch (e) {
        console.log(e);
        // log to db here.
        exit();
    }
    return doc;
}

async function createUser(json) {
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
}

module.exports = {
    createNewRoll,
    createUser
}