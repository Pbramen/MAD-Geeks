var jwt = require('jsonwebtoken');
require('dotenv').config();



function signAccessToken(username) {
    const options = {
        issuer: process.env.origin,
        audience: process.env.CLIENT_SIDE ,
        expiresIn: '20s'
    }
    console.log(username);
    return jwt.sign({username: username}, process.env.ACCESS_TK_S, options);
}

function signRefreshToken(username) {
    const options = {
        issuer: process.env.origin,
        audience: process.env.CLIENT_SIDE,
        expiresIn: '30s'
    };
    
    return jwt.sign({username: username}, process.env.REFRESH_TK_S, options)
}
 

module.exports = { signAccessToken, signRefreshToken };