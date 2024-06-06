const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { dice } = require('../../config/rollConfig');
//subdocuments

const damage_type = new Schema({
    name: {
        type: String
    },
    catagory: {
        type: String,
        enum: ['weapon', 'elemental', 'magical']
    },
    isCustom: {
        type: Boolean,
        default: false
    }
})

const level_sub = new Schema({
    level: {
        type: Number,
        min: [1, "Min value must be 0 for {Path}. Recieved {Value} instead"],
        max: [20, "Max value must be 20 for {Path}. Recieved {Value} instead"]
    }
});

const level_spell = new Schema({
    type: Number,
    min: [0, "Minimun level for spells must be 0. Recieved {Value} instead."],
    max: [9, "Minimun level for spells must be 0. Recieved {Value} instead."]
});

const obtain_sub = new Schema({
    level: level_sub,
    session: Number,
    date: {
        type: Date,
        default: Date.now()
    }
})

const item_list = new Schema({
    name: {
        type: String, 
        maxLength: [32, "Max characters for item name reached."]
    },
    descript: {
        type: String, 
        maxLength: [256, "Max length for item description reached."]
    },
    roll: {
        type: roll
    }
})

// subdocument for class
const class_sub = new Schema({
    name: String,
    obtained: obtain_sub,
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
        type: [class_sub],
        validate: {
            validator: (arr) => {
                return (arr.length > 0 ? true : false) && (arr.length <= 12 ? true : false);
            },
            message: "Array Length must be within range [1-12]"
        }
    },
    spells: [{
        name: {
            type: String,
            minLength: [4, 'Spell length {Value} must be greater than 4.'],
            maxLength: [32, 'Spell length {Value} must be less than 32']
        },
        descript: String, 
        level: level_spell,
        obtained: obtain_sub,
        spell_id: mongoose.Schema.Types.ObjectId
    }],
    items: [{
        type: item_list
    }]
})

const spell_list = new Schema({
    name: String,
    level: level_spell,
    descript: String, 
    obtained: obtain_sub,
    components: [{
        type: String,
        enum: [['V', 'S', 'M'], '{Value} is an invalid component type. Must be either V, M, or S'],
        maxLength: 1
    }],
    cast_time: {
        catagory: {
            type: String,
            enum: [['Action', 'Bonus', 'Reaction', 'Free'], "{Value} is not a valid action type."]
        },
        quantity: {
            type: Number,
            min: [0, "{Value} must be a non-negative number."]
        }
    },
    duration: {
        catagory: [{
            type: String,
            enum: [["Instant", "Concentration", "Round"], "{Value} is an invalid duration type."]
        }],
        time: {
            value: {
                type: Number,
                min: [0, "Duration cannot be less than 0."]
            },
            unit: {
                type: String,
                enum: ["round", "s", "min", "hour", "day"]
            }
        }
    }, 
    school: {
        name: {
            type: String,
            enum: [["Conjuration", "Abjuration", "Evocation", "Necormancy", "Transmutation", "Illusion", "Diviniation", "Enchantment"], "{Value} is an invalid school of magic for base 5e."]
        }
    },
    native_classes: [{
        type: String,
        enum: [["Bard", "Wizard", "Warlock", "Paladin", "Rouge", "Ranger", "Artificier", "Fighter", "Druid", "Barbarian"], '{Value} is not a valid class for baseline 5e.']
    }],
    damage: {
        damage_type: [{
            type: damage_type 
        }], 
        by_level: [{
            level: level_spell,
            damage_Roll: dice
        }]
    }
})

const checkMaxLength = function (v) { 
    return v.length <= 20;
}

const checkMaxSpells = function (v) { 
    return v.length <= 32;
}

module.exports = mongoose.model("character_sheets", character_sheet);