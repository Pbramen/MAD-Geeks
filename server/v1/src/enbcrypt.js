const bcrypt = require('bcryptjs');

async function hashNewPassword(password) { 
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

async function compareHash(password, hash) {   
    try {
        const a = await bcrypt.compare( password, hash);
        return a;
    } catch (e) {
        console.log(e);
        throw e;
    }
    

}
module.exports = {hashNewPassword, compareHash};


