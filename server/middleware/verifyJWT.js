const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({ 'msg': "Invalid headers sent"});
    const token = authHeader.split(' ')[1];
    if (token == null) {
        console.log("token no longer exists...")
        exit();
    }
    jwt.verify(
        token, process.env.ACCESS_TK_S,
        (err, decode) => {
            if (err) {
                return res.status(403).json({ 'msg': err.message })
            }
            req.user = decode.username;
            next();
        }
    )
}
module.exports = verifyJWT;