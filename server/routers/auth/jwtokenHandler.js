var jwt = require('jsonwebtoken');
require('dotenv').config();


function signToken(path, subject) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (10 * 60 * 60),
        iss: `localhost:4000/${path}`,
        aud: process.env.CLIENT_SIDE,
        subject: subject
    }, process.env.TK_S);
}

module.exports = { signToken };