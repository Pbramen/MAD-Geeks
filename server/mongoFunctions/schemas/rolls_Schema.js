const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const assert = require('node:assert');

const ranged = (e) => { 
    return (e > 0 || e < 100).test(e);
};

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
    roll: {
        // meta data about the roll
        config : { 
            type: {
                type: String,
                enum: {
                    values: ['1d100', '1d20', '1d12', '1d10', '1d8', '1d6', '1d4', '1d2'],
                    message: '{VALUE} is not a supported dice type.'
                },
                required: true
            },
            quantity: {
                type: Number,
                validate: {
                    validator: ranged,
                    message: props => `Requested ${props.value}. Must be between range 1-100` 
                },
                required: true
            },
            disadvantage: {
                type: Boolean,
                default: false
            }
            
        },
        // results of high and low.
        results: { 
            high: {
                type: Number,
                required: true
            }, 
            low: {
                type: Number,
                required: false
            }
        }
    },
    // creation date automatic TTL
    createdAt: { 
        type: Date,
        default: Date.now(),
        expires: 2629800
    }
})

const roll = mongoose.model("roll", roll_history);

// const r = new roll({
//     user: 0,
//     roll: {
//         config: {
//             type: '1d1', 
//             quantity: 111
//         }
//     }}
// );

// let err = r.validateSync();

// assert.equal(err.errors["roll.config.type"].properties.message, '1d1 is not a supported dice type.');
// assert.equal(err.errors["roll.config.quantity"].properties.message, `Requested ${Number.MAX_VALUE - 1} number of die rolled. Must be a number greater than 0.`);
const rollHistory = mongoose.model("roll_history", roll_history);
module.exports = {
    rollHistory
};