var jwt = require('jsonwebtoken');
require('dotenv').config();

function signAccessToken(username) {
    const options = {
        issuer: process.env.origin,
        audience: process.env.CLIENT_SIDE ,
        expiresIn: process.env.A_EXPIR_BY || '10m'
    }
    console.log(username);
    return jwt.sign({username: username}, process.env.ACCESS_TK_S, options);
}

function signRefreshToken(username) {
    const options = {
        issuer: process.env.origin,
        audience: process.env.CLIENT_SIDE,
        expiresIn: process.env.R_EXPIR_BY || '1h'
    };
    
    return jwt.sign({username: username}, process.env.REFRESH_TK_S, options)
}
 

module.exports = { signAccessToken, signRefreshToken };