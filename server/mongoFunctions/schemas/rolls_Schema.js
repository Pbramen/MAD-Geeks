const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roll_cached = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'useraccounts',
        required: true,
        immutable: true
    },
    hasExtra: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Date,
        default: Date.now(),
    }

}, {
    methods: {
        findOldestEntry() {
            return mongoose.model("roll_cached").findOneAndDelete().sort({ createdBy: 1 });
        }
    }
})

const roll_history = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'useraccounts',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 2629800
    }
})

const rollcache = mongoose.model("roll_cached", roll_cached);
const rollHistory = mongoose.model("roll_history", roll_history);
module.exports = {
    rollcache, rollHistory
};