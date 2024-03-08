const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const character_sheet = Schema({
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
        type: [{
            name: String,
            levelObtained: Number
        }],
        validate: {
            validator: checkMaxLength,
            message: "Too many classes!"
        }
    },
    spells: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: checkMaxSpells,
            message: "Too many spells!"
        }
    },
    feats: {
        type: [String]
    },
    proficiency: {
        type: [String]
    }
})

// need features

const checkMaxLength = function (v) { 
    return v.length <= 20;
}

const checkMaxSpells = function (v) { 
    return v.length <= 32;
}

module.exports = mongoose.model("character_sheets", character_sheet);