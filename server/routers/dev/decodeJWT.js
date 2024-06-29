const jwt = require('jsonwebtoken');
const { userModel } = require('../../mongoFunctions/schemas/client_Schema');

const decodeTest = (req, res) => {
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
        async (err, decode) => {
            if (err) {
                return res.status(403).json({ 'msg': err.message })
            }
            if (decode.username) {
                const result = await userModel.aggregate([
                    {
                        $match: { userLogin: decode.username }
                    },
                    {
                        $lookup: {
                            from: 'useraccounts',
                            localField: '_id',
                            foreignField: 'userAuthId',
                            as: 'userDetail'
                        }
                    },
                    {
                        $limit: 1
                    }
                ]);
                const role = result[0]['userDetail'][0]['role'];
                return res.status(200).json({...decode, "role": role});
            }
        }
    )
}


module.exports = {decodeTest}