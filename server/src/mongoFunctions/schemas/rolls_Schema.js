const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require("path")
const { roll_state, roll_type, dice } = require(path.resolve(__dirname,"../../config/rollConfig"));

// Type of die that was rolled.
const die_roll = new Schema({
    die_type: {
        type: Number,
        enum: [dice , "{Value} is an invalid die type."],
        required: true
    },
    quantity: {
        type: Number,
        min: [0, "Number of rolls must be positive. Recieved {Value} instead"],
        max: [100, "Limited to 100 die rolled at once. Recieved {Value} instead"],
        required: true
    },
    state: {
        type: Number,
        enum: roll_state,
        default: roll_state.NONE
    },
    objective: {
        type: Number,
        enum: roll_type,
        default: roll_type.OTHER
    }
});

const roll_result = new Schema({
    base_roll: {
        type: [Number],
        min: [1, "Illegal die value {VALUE}."],
        validate:
        {
            validator: (arr) => { 
                return arr.length <= 100 && arr.length > 0;
            },
            mesage: 'Array must be greater than 0 and less than 101.'
        }
    },
    proficiency: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    stat_bonus: {
        type: Number,
        min: -15,
        max: 15,
        required: true
    },
    other_mods: {
        type: [{
            name: { type: String },
            bonus: { type: Number },
            source: { type: String }
        }]
    }
})

/**
 * History of rolls for each user (many-to-squillion)
 * roll_history.user references the user's roll. 
 * 
 */
const roll_history = new Schema({
    // user information
    user: { 
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String
    },
    roll: die_roll,
    result: {
        first_roll: {
            type: roll_result,
            required: true
        },
        second_roll: {
            type: roll_result
        }
    },
    campaign_id: {
        type: Schema.Types.ObjectId,
    },
    // creation date automatic TTL
    createdAt: { 
        type: Date,
        default: Date.now(),
        expires: 2629800
    }
})

const rollHistory = mongoose.model("roll_history", roll_history);
module.exports = {
    rollHistory
};