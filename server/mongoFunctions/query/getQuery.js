const rollHistory = require("../schemas/rolls_Schema");
const mongoose = require('mongoose');
const {userModel, accountModel} = require("../schemas/client_Schema");

/**
 * checks if username or email is unique before inserting into db.
 * @param {String} mail - email of user
 * @param {String} user - username 
 * @returns {Number} - if username and email is available, returns 0. If username is taken, returns -1, Else returns -2.
 */
async function isTaken(mail, user) {
    var res = 0;
    await userModel.exists({ userLogin: user }).then(count => {
        if (count != null) {
            res -= 1;
        }
    })
    await userModel.exists({ userLogin: user }).then(count => {
        if (count != null) {
            res -= 2;
        }
    })
    return res;
}

module.exports = {
    isTaken
}
