const bcrypt = require('bcrypt');

async function saltAndHash(password) { 
    try {
        const salt = await bcrypt.genSalt();
        hashed = await bcrypt.hash(password, salt);
    } catch (e) { 
        console.log(e);
        // TODO : WRITE TO ERROR LOG HERE
        throw Error({"message" : "Unable to process password..."})
    }
    return hashed;
}
module.exports = saltAndHash;