// type interface to use for character sheets only
// applicable to 5.E only


// helper interfaces 
interface proficiency{
    "bonus": string,
    "stats": string[],
    "weapons": string[],
    "skills": {
        "name": string,
        "expertise": boolean
    },
    "saving_throws": {
        "name": "string",
        "expertise": true
    }
}

// s = somatic, v = verbal, m = material
type components = 's' | 'v' | 'm';
type spellSchool = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
type spellLevel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type classLevel = spellLevel | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

interface spells {
    "name": string,
    "description"?: string,
    "components": components[],
    "school": spellSchool[],
    "level": spellLevel
}
interface stat_block{
    "name": string,
    "base_value": number,
    "bonuses"?: {
        "name": string,
        "description"?: string,
        "value": number
    }
}
interface a_class{
    "level": number
    "levels_obtained_at": number[]
}
interface class_resources{
    "class": { // source 
        "origin": string,
        "subClass"?: string
    },
    "name": string, // name of the resource itself
    "descript"?: string,
    "cur_value"?: number,
    "max_value"?: number
}

//  ----- TO BE REVIEWED: ------
interface other_info {
    "name": string,
    "value": 0
}
interface other_title {
    "title": "string",
    "descript": "string"
}
// ----- END OF REVIEW: ------

interface items {
    "cost": {
        // user may not use the default dnd currecny system.
        "default_currency"?: {
            "copper": number,
            "silver": number,
            "electrum": number,
            "gold": number,
            "platinum": number
        }
    },
    // users may not use weight mechanics
    "weight"?: {
        "value": number,
        "units": string
    },
    "quantity": number,
    "magic_lvl": number,
    "descript"?: string
}

// actual resposne body
export interface CharacterSheetType {
"payload": {
    "first_name": string,
    "last_name"?: string,
    "middle_name"?: string,
    "aliases"?: string[],
    "proficiency": proficiency,
    "hit_die": {
        "current_value": number,
        "max_value": number
    },
    "AC": number,
    "base_saving_throw": number,
    "movement": {
        "value": number,
        "units": 'ft' | 'm' 
    },
    level: classLevel,
    "items": items[],
    "spells": spells[],
    "class_resources": class_resources[],
    "stats": {
        "stat_block": stat_block[],
    "others": other_info[]
    },
    // TODO: Addjust this in yaml
    "classes": { // at least one exists...
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
    "background"?: {
        "name": string,
        "descript"?: string
    },
    "other_info"?: other_title[]
}}

// response meta info
export interface responseType {
        "status": string,
        "msg": string,
        "owner": string,
        "permissions": number,
      }
