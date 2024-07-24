// type interface to use for character sheets only
// applicable to 5.E only


// helper interfaces 
interface proficiency{
    "bonus"?: string,
    "stats"?: string[],
    "weapons"?: string[],
    "skills"?: {
        "name"?: string,
        "expertise"?: boolean
    },
    "saving_throws"?: {
        "name"?: string,
        "expertise"?: boolean
    }
}

// s = somatic, v = verbal, m = material
type components = 's' | 'v' | 'm';
type spellSchool = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
type spellLevel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type classLevel = spellLevel | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

interface spells {
    "name"?: string,
    "description"?: string,
    "components"?: components[],
    "school"?: spellSchool[],
    "level"?: spellLevel
}
interface block {
    "base_value"?: number,
    "bonuses"?: {
        "name"?: string,
        "description"?: string,
        "value"?: number
    }
}

interface stat_block {
    "STR"?: block,
    "CON"?: block,
    "DEX"?: block,
    "WIS"?: block,
    "INT"?: block,
    "CHAR"?: block
}
interface a_class{
    "level"?: number
    "levels_obtained_at"?: number[]
}
interface class_resources{
    "class"?: { // source 
        "origin"?: string,
        "subClass"?: string
    },
    "name"?: string, // name of the resource itself
    "descript"?: string,
    "cur_value"?: number,
    "max_value"?: number
}

//  ----- TO BE REVIEWED: ------
interface other_title {
    "title"?: "string",
    "descript"?: "string"
}
// ----- END OF REVIEW: ------

interface items {
    "cost"?: {
        // user may not use the default dnd currecny system.
        "default_currency"?: {
            "copper"?: number,
            "silver"?: number,
            "electrum"?: number,
            "gold"?: number,
            "platinum"?: number
        }
    },
    // users may not use weight mechanics
    "weight"?: {
        "value"?: number,
        "units"?: string
    },
    "quantity"?: number,
    "magic_lvl"?: number,
    "descript"?: string
}

// actual resposne body
export interface CharacterSheetType {
    // biography
    "first_name"?: string,
    "last_name"?: string,
    "middle_name"?: string,
    "dob"? : string,
    "aliases"?: string[],    
    "background"?: {
        "name"?: string,
        "descript"?: string
        },
    "archetype"?: string, // TODO: add to schema;
    "species"?: string, // TOOD: add to schema

    // classes & subclasses
    // TODO: Addjust this in yaml
    level?: classLevel,
    "classes"?: { // at least one exists...
        "barbarian"?: a_class,
        "bard"?: a_class,
        "cleric"?: a_class,
        "druid"?: a_class,
        "fighter"?: a_class,
        "monk"?: a_class,
        "paladin"?: a_class,
        "ranger"?: a_class,
        "rogue"?: a_class,
        "sorcerer"?: a_class,
        "warlock"?: a_class,
        "wizard"?: a_class,
    },
    "hit_die"?: {
        "current_value"?: number,
        "max_value"?: number
    },

    // skills and stats
    "class_resources"?: class_resources[],
    // ===   Displayed on all pages AND updated once set  === //
    "stats"?: {
        "stat_block"?: stat_block,
        "others"?: block[]
    },  
    "base_saving_throw"?: number,
    "AC"?: number,
    // ===                       END                     === //
    "proficiency"?: proficiency,

    "movement"?: {
        "value"?: number,
        "units"?: 'ft' | 'm' 
    },
    // Inventory
    "items"?: items[],
    // Spells
    "spells"?: spells[],

    // Other custom data 
    "other_info"?: other_title[]
}

// initializes an empty array
export function factoryCharacterSheet() {
    // init all subobjects
    const block: block = {
        "base_value": -1,
        "bonuses": {
            "name": "",
            "description": "",
            "value": -1
        }
    }
    const a_class: a_class = {
        "level": 0,
        "levels_obtained_at": []
    }
    const classLevel: classLevel = 0;
    const class_resources: class_resources = {
        "class": { // source 
            "origin": "",
            "subClass": ""
        },
        "name": "", 
        "descript": "",
        "cur_value": -1,
        "max_value": -1
    }
    const stat_block: stat_block = {
        "STR": block,
        "CON": block,
        "DEX": block,
        "INT": block,
        "WIS": block,
        "CHAR": block,
    }
    const proficiency : proficiency = {
        "bonus": "",
        "stats": [],
        "weapons": [],
        "skills": {
            "name": "",
            "expertise": false
        },
        "saving_throws": {
            "name": "",
            "expertise": false
        }
    }




const items: items  = {
    "cost": {
        // user may not use the default dnd currecny system.
        "default_currency": {
            "copper": 0,
            "silver": 0,
            "electrum": 0,
            "gold": 0,
            "platinum": 0
        }
    },
    // users may not use weight mechanics
    "weight": {
        "value": 0,
        "units": "lbs"
    },
    "quantity": 0,
    "magic_lvl": 0,
    "descript": ""
    }

    const spells: spells  = {
        "name": "",
        "description": "",
        "components": [],
        "school": [],
        "level": 0
    }

    const product : CharacterSheetType = {
        "first_name": "",
        "last_name": "",
        "middle_name": "",
        "dob" : "",
        "aliases": [],    
        "background": {
            "name": "",
            "descript": ""
            },
        "archetype": "", // TODO: add to schema;
        "species": "", // TOOD: add to schema
    
        // classes & subclasses
        // TODO: Addjust this in yaml
        level: classLevel,
        "classes": { // at least one exists...
            "barbarian": a_class,
            "bard": a_class,
            "cleric": a_class,
            "druid": a_class,
            "fighter": a_class,
            "monk": a_class,
            "paladin": a_class,
            "ranger": a_class,
            "rogue": a_class,
            "sorcerer": a_class,
            "warlock": a_class,
            "wizard": a_class,
        },
        "hit_die": {
            "current_value": -1,
            "max_value": -1
        },
    
        // skills and stats
        "class_resources": [],
        // ===   Displayed on all pages AND updated once set  === //
        "stats": {
            "stat_block": stat_block,
            "others": []
        },  
        "base_saving_throw": -1,
        "AC": -1,
        // ===                       END                     === //
        "proficiency": proficiency,
    
        "movement": {
            "value": -1,
            "units": 'ft' 
        },
        // Inventory
        "items": [],
        // Spells
        "spells": [],
    
        // Other custom data 
        "other_info": []
    }
    return (
       product
    )
}

// response meta info
export interface responseType {
        "status": string,
        "msg": string,
        "owner": string,
        "permissions": number,
      }
