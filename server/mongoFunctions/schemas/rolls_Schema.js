const mongoose = require('mongoose');
const user_Model  = require('./client_Schema.js');
const Schema = mongoose.Schema;

const die_result = new Schema({
    die_type: {
        type: String,
        enum: ['d2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
    }, 
    quantity: {
        type: Number, 
        required: true,
        min: 1, 
        max: 100
    },
    bonus: {
        type: Number,
        min: 0
    },
    die_result: {
        type: Number, 
        required: true
    }

})

const roll_log = new Schema({
    // source_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: user_Model, 
    //     required: true
    // },
    source: {
        type: String, 
        //enum: ['player', 'character', 'dm', 'other'],
        required: true
    },
    die_result: {
        type: die_result,
        required: true
    }
    
}, { timestamps: true });

const roll_Log = mongoose.model('Roll_Log', roll_log);
const die_Result = mongoose.model('Die_Result', die_result);
module.exports = {roll_Log, die_Result}

