const usr_Model = require('../mongoFunctions/schemas/client_Schema.js');
const {roll_Log, die_Result } = require('../mongoFunctions/schemas/rolls_Schema.js')


function test1(req, res) { 
    return res.status(200).json({ status: 200 });
}

async function postUser (req, res) { 
    //TODO: parse out the parameters and validate before querying    
    const { name, test, devices } = req.body;
    try {
        console.log(usr_Model.db.name);
        const diR = new die_Result({
            die_type: "d2",
            quantity: 3,
            bonus: 0,
            die_result: 2
        })
        const Roll = new roll_Log({
            source: 'player',
            die_result: diR
        })
        await Roll.save();
    } catch (error) { 
        console.log(error);
        return res.status(400).json({status: 400});
    }

    return res.status(200).json({status: 200})
}

module.exports = {
    test1,
    postUser
}
