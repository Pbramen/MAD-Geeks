const path = require("path");
const { userModel } = require(path.resolve(__dirname, '../../mongoFunctions/schemas/client_Schema.js'));
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { jwtName, jwtOption } = require(path.resolve(__dirname, '../../jwt/jwtCookieConfig.js'));

 function logOut (req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(204).json({ 'status': 'ok', 'msg': "User already logged out.", 'link': '/login' });
    const refresh_token = cookies.jwt;

    jwt.verify(
        refresh_token, process.env.REFRESH_TK_S,
        async (err, decode) => {
            //clear cookie
            await userModel.findOneAndUpdate({ userLogin: decode?.username }, { refreshToken: "" })
                
            if (err) {
                // need to clear cookie still.
                res.clearCookie(jwtName, jwtOption);
                return res.status(203).json({ 'status': "Ok", "msg": "You have Successfully logged out!", 'link': '/home' });
            }
            try {
                res.clearCookie(jwtName, jwtOption);
            } catch (e) {
                return res.status(500).json({ "status": "DB_FAILURE ", 'msg': "Sever failure. Please try again." });
            }
            return res.status(200).json({'status': "ok", 'msg': "You have successfully logged out!", 'link': '/home'})
        }
    )
}
module.exports= {logOut};