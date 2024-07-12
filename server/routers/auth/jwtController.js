const path = require("path")
const { userModel } = require(path.resolve(__dirname, '../../mongoFunctions/schemas/client_Schema.js'));
require('dotenv').config();
const { signAccessToken } = require(path.resolve(__dirname, "../../jwt/jwtokenHandler.js"));
const jwt = require('jsonwebtoken');
const jwtConfig = require(path.resolve(__dirname, '../../jwt/jwtCookieConfig.js'));


// refresh if not expired.
const handleRefreshToken = (req, res, next) => {
    console.log('refreshing...');
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        console.log("unable to find token...")
        res.status(401).json({
            status: "UNAUTH",
            msg: 'No jwt token found'
        });
        next();
    }
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken, process.env.REFRESH_TK_S,
        async (err, decoded) => {
            //const stored_tk = await userModel.findOne({ userLogin: decoded?.username }).select({ refreshToken });
            // refresh token does not exist or has expired.
           
            if (err ) {
                // unauthroized
                res.status(403).json({
                    status: 'UNAUTHORIZED',
                    msg: 'JWT expired, does not exist, or has been corrupted.'
                });
                next();
            }
            
            console.log((decoded.exp - (Date.now() /1000)), ' seconds left');
            const new_access_token = signAccessToken(decoded.username);

            res.status(200).json({
                'status': 'OK',
                "access_token": new_access_token
            });
            next();
        }
    )
}


// access token check
const verifyJWT = (req, res, next) => {
    console.log('verifying access token...')
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        res.status(401).json({
            'status': 'UNAUTHORIZED',
            'msg': "Invalid headers sent"
        });
        // TODO: next(error);
    const token = authHeader.split(' ')[1];
    if (token == null) {
        console.log("token no longer exists...")
        exit();
    }
    jwt.verify(
        token, process.env.ACCESS_TK_S,
        (err, decode) => {
            if (err) {
                res.status(403).json({
                    'status': "EXPIR",
                    'msg': err.message
                })
                next(err);
            }
            res.locals.jwt_D = decode;
            Object.freeze(res.locals.jwt_D)
            next();
        }
    )
}

// return a new access token if user is already logged in (non-route)
const checkIfUserLoggedIn = (payload, token) => {
    const condition = jwt.verify(token, process.jwt.REFRESH_TK_S, (err, decode) => {
        if (err) {
            return false;
        }
        return signAccessToken(payload);
    })
    return condition;
}

module.exports = {handleRefreshToken, verifyJWT, checkIfUserLoggedIn};