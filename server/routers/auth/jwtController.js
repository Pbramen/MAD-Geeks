const path = require("path")
const { userModel } = require(path.resolve(__dirname, '../../mongoFunctions/schemas/client_Schema.js'));
require('dotenv').config();
const { signAccessToken } = require(path.resolve(__dirname, "../../jwt/jwtokenHandler.js"));
const jwt = require('jsonwebtoken');
const jwtConfig = require(path.resolve(__dirname, '../../jwt/jwtCookieConfig.js'));

// check if user is already logged in -> ( must have a jwt cookie AND valid refresh token stored)




// refresh if not expired.
const handleRefreshToken = (req, res) => {
    console.log('refreshing...');
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        console.log("unable to find token...")
        return res.status(401).json({"msg": 'Unauthroized request'});
    }
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken, process.env.REFRESH_TK_S,
        async (err, decoded) => {
            //const stored_tk = await userModel.findOne({ userLogin: decoded?.username }).select({ refreshToken });
            // refresh token does not exist or has expired.
           
            if (err ) {
                // unauthroized
                console.log(err);
                return res.sendStatus(403);
            }
            
            console.log((decoded.exp - (Date.now() /1000)), ' seconds left');
            const new_access_token = signAccessToken(decoded.username);

            return res.status(200).json({
                'status': 'OK',
                "access_token": new_access_token
            });
        }
    )
}


// access token check
const verifyJWT = (req, res, next) => {
    console.log("verifying...");
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log("\tauth header detected...")
    const token = authHeader.split(' ')[1];
    jwt.verify(jwtConfig.name, token, process.env.ACCESS_TK_S,
        (err, decode) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
                next(err);
            }
            req.user = decode.username; // for passport.js
            next();
        }
    );
}

module.exports = {handleRefreshToken, verifyJWT};