const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//subdocument for level
const level_sub = new Schema({
    level: {
        type: Number,
        min: [1, "Min value must be 0 for {Path}. Recieved {Value} instead"],
        max: [20, "Max value must be 20 for {Path}. Recieved {Value} instead"]
    }
});
// subdocument for class
const class_sub = new Schema({
    name: String,
    obtained: {
        level: level_sub,
        session: Number,
        date: Date
    },
    features: [{
        name: String,
        descript: String,
        level: level_sub
    }],
    resources: [{
        name: String,
        descript: String,
        quantity: {
            capacity: {
                type: Number,
                min: [0, "{Path} must be a value greater than 0. Recieved {Value} instead."],
            },
            // maybe greater than capcity
            current: Number
        }
    }]
});

// document revision per level ? 
const character_sheet = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fName: {
        type: String,
        required: true,
        maxLength: [32, "Max character length for first name is 32!"]
    },
    mName: {
        type: String,
        maxLength: [64, "Max character length for middle name(s) is 64!"]
    },
    lName: {
        type: String,
        maxLength: [32, "Max character length for last name is 32!"]
    },
    classes: {
        type: [class_sub]
    },
    spells: [{
        name: {
            type: String,
            minLength: [4, 'Spell length {Value} must be greater than 4.'],
            maxLength: [32, 'Spell length {Value} must be less than 32']
        },
        descript: String, 
        level: {
            type: Number,
            min: 0,
            max: 9
        },
        obtained: {
            level: Number,
            session: Number
        },
        spell_id: mongoose.Schema.Types.ObjectId
    }]
})

const checkMaxLength = function (v) { 
    return v.length <= 20;
}

const checkMaxSpells = function (v) { 
    return v.length <= 32;
}

module.exports = mongoose.model("character_sheets", character_sheet);