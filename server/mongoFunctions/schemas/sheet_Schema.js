const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require('path')
const { dice } = require(path.resolve(__dirname, '../../config/rollConfig'));

const length_exceeded_msg =  "$PATH must be less than 32 characters long"
const roll_enum = [1, 2, 4, 6, 8, 10, 12, 20, 100]


const roll = new Schema( {
    die: {
        type: Number,
        enum: roll_enum,
        required: true
    },
    quantity: {
        type: Number,
        min: [0, "$PATH must be a positive number!"],
        required: true
    },
    min_r: {
        type: Number,
        min: 0,
        validator: {
            validate: (value) => {
                return this.get("die") >= value;
            }
        }
    },
    max_r: {
        type: Number,
        validator: {
            validate: (value) => {
                return this.get("die") >= value;
            }
        },
        min: 0
    }
}
)

const roll_damage = new Schema({
    
    die: {
        type: Number,
        enum: roll_enum,
        required: true
    },
    quantity: {
        type: Number,
        min: [0, "$PATH must be a positive number!"],
        required: true
    },
    min_r: {
        type: Number,
        min: 0,
        validator: {
            validate: (value) => {
                return this.get("die") >= value;
            }
        }
    },
    max_r: {
        type: Number,
        validator: {
            validate: (value) => {
                return this.get("die") >= value;
            }
        },
        min: 0
    },
    damage_type: {
        type: String, 
        enum: ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"]
    }
}
)
const sub_pool = new Schema({
    current: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true,
    }
})
const sub_hit_die = new Schema({
    roll: {
        type: roll,
        required: true  
    },
    pool: {
        type: sub_pool,
        required: true
    }})

const sub_skill_info = new Schema({
    proficiency: { type: Boolean, default: false, required: true },
    expertise: { type: Boolean },
    bonus: { type: Number }
})

const sub_skills = new Schema({
    acrobatics: sub_skill_info,
    animal_handling: sub_skill_info,
    arcana: sub_skill_info,
    athletics: sub_skill_info,
    deception: sub_skill_info,
    history: sub_skill_info,
    insight: sub_skill_info,
    intimidation: sub_skill_info,
    investigation: sub_skill_info,
    medicine: sub_skill_info,
    nature: sub_skill_info,
    perception: sub_skill_info,
    performance: sub_skill_info,
    persuasion: sub_skill_info,
    religion: sub_skill_info,
    sleight_of_hand: sub_skill_info,
    survival: sub_skill_info
})
const sub_saving_throw = new Schema({
    str: sub_skill_info,
    dex: sub_skill_info,
    con: sub_skill_info,
    int: sub_skill_info,
    wis: sub_skill_info,
    char: sub_skill_info
})

const sub_combat = new Schema({
    AC: {
        type: Number,
        min: [0, "$PATH must be greater than 0"],
        max: [40, "$PATH must be less than 40"],
        required: true
    },
    hit_die: {
        type: sub_hit_die,
        required: true
    },
    saving_throw: {
        type: sub_saving_throw,
        required: true
    },})

const demo = new Schema({
    first_name: {
        type: String,
        maxLength: [32, "$PATH must be less than 32 characters long"]
    },
    last_name:  {
        type: String,
        maxLength: [32, "$PATH must be less than 32 characters long"]
    },
    middle_name: {
        type: String,
        maxLength: [32, "$PATH must be less than 32 characters long"]
    },
    species: {
        type: String,
        maxLength: [32, "$PATH must be less than 32 characters long"]
    },
    aliases: {
        type: [String],
        validator: {
            validate: (arr) => {
                if (arr.length >= 7)
                    return false;
                arr.forEach(el => {
                    if (el.length >= 32)
                        return false
                })
            }
        }
    },
})
const sub_stat_block = new Schema({ 
    base: {
        type: [Number],
        default: [0, 0, 0, 0, 0],
        // [str, con, dex, wis, int, char]
        validator: {
            validate: (value) =>  value.length === 6
        }
    },
    bonuses: {
        type: [{
            name: { type: String },
            value: { type: Number }
        }],
        // [str, con, dex, wis, int, char]
        validator: {
            validate: (value) =>  value.length === 6
        }
    }
})

const sub_spells = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: [32, "Spells cannot exceed 32 characters"]
    },
    offical_SRD: {
        type: Schema.Types.ObjectId
    },
    component: {
        type: String,
        enum: ["v", "s", "c"],
        required: true
    },
    school: {
        type: [String],
        enum: [],
        required: true
    }
})

const sub_classes = new Schema({
    SRD: {
        "Artificer": {
            type: Number
        },
        "Barbarian": {
            type: Number
        },
        "Bard": {
            type: Number
        },
        "Cleric": {
            type: Number
        },
        "Druid": {
            type: Number
        },
        "Fighter": {
            type: Number
        },
        "Monk": {
            type: Number
        },
        "Paladin": {
            type: Number
        },
        "Ranger": {
            type: Number
        },
        "Rogue": {
            type: Number
        },
        "Sorcerer": {
            type: Number
        },
        "Warlock": {
            type: Number
        },
        "Wizard": {
            type: Number
        }
    },
    custom: [{
        name: {
            type: String,
            maxlength: [16, "$Path must be less than 16"],
            required: true
        },
        value: {
            type: Number,
            minmimun: [0, "$Path must be greater than 0"]
            
        }
    }]
})
const CharacterSchema = new Schema({
    demographic: {
        type: demo,
        required: true
    },
    appearance: {
        eyes: { type: String },
        height: {
            val: { type: String },
            units: { type: String, default: 'ft' }
        },
        weight: {
            val: { type: String },
            units: { type: String, default: 'lbs' }
        },
        skin: { type: String },
        hair: { type: String },
        img: {
            type: [String],
            validate: {
                validator: (array) => {
                    return array.length <= 5;
                }
            }
        },
        other: {
            name: { type: String },
            value: { type: String }
        }
    },
    traits: {
        personality: { type: String },
        ideals: { type: String },
        bonds: { type: String },
        flaws: { type: String },
        alignment: { type: Number }
    },
    background: {
        backstory: { type: String },
        allies: { type: String },
        fraction: { type: String },
        enemies: { type: String }
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    combat: {
        type: sub_combat,
        required: true
    },
    skills: {
        type: sub_skills,
        required: true
    },
    // classes are in alpha order
    classes: {
        type: sub_classes,
        validator: {
            validate: (e) => {
                if (this.get("level")) {
                    var total = 0;
                    if (e.values().length === 2) {
                        e.custom.forEach((classElement) => {
                            total += classElement.value;
                        })
                    }
                    e.SRD.values().forEach((classElement) => {
                        total += classElement
                    })
                    return total <= this.get("level");
                }
            }
        }
    },
    stat_block: {
        // [str, con, dex, wis, int, char]
        type: [sub_stat_block], 
        valiator: {
            validate: (value) => {
                return value.length === 6;
            }
        },
        required: true
    },
    ability_feats: [{
        name: { type: String },
        obtained_at: { type: Number }
    }],
    inventory: {
        equipment: [{
            name: { type: String },
            rarity: { type: Number },
            descript: { type: String },
            roll: { type: roll_damage},
            weight: {
                value: { type: Number },
                units: { type: String }
            },
            count: {
                type: sub_pool
            },
            currency: {
                electrium: { type: Number, default: 0 },
                platinum: { type: Number, default: 0 },
                gold: { type: Number, default: 0 },
                silver: { type: Number, default: 0 },
                copper: { type: Number, default: 0 },
                custom: [{
                    name: { type: String },
                    value: { type: Number }
                }]
            }
        }]
    },
    spells: [sub_spells]
        
});

const sheet_model =  mongoose.model("character_sheets", CharacterSchema);

module.exports = {sheet_model}