const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*TODO: 
    log execution time of queries and compare embedded vs reference
*/

const subClass = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 24
    },
    level_obtained: {
        type: Number,
        required: false,
        min: 1,
        max: 20
    }  
})

// maybe reference instead? many-to-many relationship
// we do not want to query characters based on feats/spells/resources?
const feats = new Schema({
    
})
const classes = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 24
    },
    level_obtained: {
        type: Number,
        required: false,
        min: 1,
        max: 20
    }
})

const class_resources = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 24
    },
    //check current uses left on client side?
    max_use: Number
}) 

const spells = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32
    },
    descript: {
        type: String,
        required: false,
        maxLength: 256
    },
    school: {
        type: String,
        required: true,
        enum: []
    },
    slot: {
        type: Number,
        min: 0,
        max: 10,
        required: false
    }
})

const userModel = new Schema({
    usr_name: {
        type: String, 
        maxLength: 16,
        required: true
    },
    password: {
        type: String, 
        maxLength: 64,
        required: true
    },
    role: {
        type: String, 
        enum: ['usr', 'web_admin', 'db_admin', 'sys_admin'] ,   
        required: true,
        default: 'usr'
    }
}, { timestamps: true })

const characterModel = new Schema({
    first_name: {
        type: String,
        maxLength: 32,
        required: true
    },
    last_name: {
        type: String,
        maxLength: 32
    },
    level: {
        type: Number,
        max: 20,
        min: 1,
        required: true
    },
    classes: {
        type: [classes],
        validate: [(val) => { return val.length <= 20 }, '{PATH} must be less than 20.']
    },
    class_resources: {
        type: [class_resources],
        validate: [(val) => { return val.length <= 20 }, , '{PATH} must be less than 20.'],
        required: false
    },
    spells: {
        type: [spells],
        validate: [(val) => { return val.length <= 36 }, '{PATH} must be less than 36.'],
        required: false
    }
}, {timestamps: true})



const user_Model = mongoose.model("user", userModel);
module.exports = user_Model;
