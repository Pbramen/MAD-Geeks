// type interface to use for character sheets only
// applicable to 5.E only
// s = somatic, v = verbal, m = material
type components = 's' | 'v' | 'm';
type spellSchool = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
type spellLevel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type alignment = spellLevel;
type classLevel = spellLevel | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
type die_type = 1 | 2 | 4 | 6 | 8 | 10 | 12 | 20 | 100

interface customData{
    "value"?: number,
    "name"?: string
}
interface spells {
    "official_SRD"?: string,
    "name"?: string,
    "descript"?: string,
    "components"?: components[],
    "school"?: spellSchool[],
}

interface stat_block {
    "base"?: number,
    "bonuses"?: customData[]
}

interface roll{
    "die"?: die_type,
    "quantity"?: number, // todo: limit range.
    "min_r"?: number,
    "max_r"?: number
}
interface pool{
    "current"?: number,
    "max"?: number
}
interface bonus_info{
    "proficiency"?: boolean,
    "expertise"?: boolean,
    "bonus"?: number
}
interface saving_throw{
    "str": bonus_info,
    "dex": bonus_info,
    "con": bonus_info,
    "wis": bonus_info,
    "int": bonus_info,
    "char": bonus_info
}
interface combat{
    "AC"?: number,
    "hit_die"?: {
        "roll"?: roll,
        "pool"?: pool
    },
    "saving_throw"?: saving_throw,
    "movement"?: number,
    "ability_feats"?: string[]
}
interface skills {
    "acrobatics"?: bonus_info,
    "animal_handling"?: bonus_info,
    "arcana"?: bonus_info,
    "athletics"?: bonus_info,
    "deception"?: bonus_info,
    "history"?: bonus_info,
    "insight"?: bonus_info,
    "intimidation"?: bonus_info,
    "investigation"?: bonus_info,
    "medicine"?: bonus_info,
    "nature"?: bonus_info,
    "perception"?: bonus_info,
    "performance"?: bonus_info,
    "persuasion"?: bonus_info,
    "religion"?: bonus_info,
    "sleight_of_hand"?: bonus_info,
    "stealth"?: bonus_info,
    "survival"?: bonus_info
  }
interface weight {
    "val": number,
    "units": string
}
interface appearance {
    "eyes"?: string,
    "height"?: {
        "val"?: string,
        "units"?: string
    },
    "weight"?: weight,
    "skin"?: string,
    "hair"?: string,
    "img"?: string[],
    "other"?: {
        "name"?: string,
        "value"?: string
    }
}
export interface demographic {
    "first_name"?: string,
    "last_name"?: string,
    "middle_name"?: string,
    "aliases"?: string,    
    // "background"?: {
    //     "name"?: string,
    //     "descript"?: string
    //     },
    // "archetype"?: string, // TODO: add to schema;
    "species"?: string,
    "age"?: number,
    "gender"?: string
}
interface traits {
    "personality"?: string,
    "ideals"?: string,
    "bonds"?: string,
    "flaws"?: string, 
    "alignment"?: alignment
}
export interface background {
    "backstory"?: string, 
    "allies"?: string,
    "fraction"?: string,
    "enemies"?: string,
    "architype"?: string
}
interface equipment{
    "name"?: string,
    "rarity"?: number,
    "descript"?: string,
    "roll"?: roll & {
        "damage_type"?: string
    },
    "weight"?: weight,
    "count"?: pool,
}
interface currency { 
    "electrium"?: number,
    "platinum"?: number,
    "gold"?: number,
    "silver"?: number,
    "copper"?: number,
    "custom"?: customData[]
}
interface inventory {
    "equipment"?: equipment[],
    "currency"?: currency
}
export interface class_type {
    "SRD"?: {
        "barbarian"?: classLevel,
        "bard"?: classLevel,
        "cleric"?: classLevel,
        "druid"?: classLevel,
        "fighter"?: classLevel,
        "monk"?: classLevel,
        "paladin"?: classLevel,
        "ranger"?: classLevel,
        "rogue"?: classLevel,
        "sorcerer"?: classLevel,
        "warlock"?: classLevel,
        "wizard"?: classLevel
      },      
    "custom"?: customData[]
}

export interface CharacterSheetType {
    // biography
    "demographic"?: demographic,
    "appearance"?: appearance,
    "traits"?: traits,
    "background"?: background, 
    // classes & subclasses
    // TODO: Addjust this in yaml
    "level"?: number,
    "combat"?: combat,
    "skills"?: skills,
    "classes"?: class_type,
    "stat_block"?: stat_block[],
    
    // Inventory
    "inventory"?: inventory
    // Spells
    "spells"?: spells[],

}

// initializes an empty array
export const factoryCharacterSheet = () => {

    const product: CharacterSheetType = {
        "demographic": {
          "first_name": "",
          "last_name": "",
          "middle_name": "",
          "species": "",
          "aliases": ""
        },
        "appearance": {
          "eyes": "",
          "height": {
            "val": "",
            "units": "ft"
          },
          "weight": {
            "val": 0,
            "units": "lbs"
          },
          "skin": "",
          "hair": "",
          "img": [
            ""
          ],
          "other": {
            "name": "",
            "value": ""
          }
        },
        "traits": {
          "personality": "",
          "ideals": "",
          "bonds": "",
          "flaws": "",
          "alignment": 9
        },
        "background": {
          "backstory": "",
          "allies": "",
          "fraction": "",
          "enemies": ""
        },
        "level": 0,
        "combat": {
          "AC": 0,
          "hit_die": {
            "roll": {
              "die": 1,
              "quantity": 100,
              "min_r": 0,
              "max_r": 0
            },
            "pool": {
              "current": 0,
              "max": 0
            }
          },
          "saving_throw": {
            "str": {
              "proficiency": false,
              "expertise": true,
              "bonus": 0
            },
            "dex": {
              "proficiency": false,
              "expertise": false,
              "bonus": 0
            },
            "con": {
              "proficiency": false,
              "expertise": false,
              "bonus": 0
            },
            "int": {
              "proficiency": false,
              "expertise": false,
              "bonus": 0
            },
            "wis": {
              "proficiency": false,
              "expertise": false,
              "bonus": 0
            },
            "char": {
              "proficiency": false,
              "expertise": false,
              "bonus": 0
            }
          },
          "movement": 0,
          "ability_feats": [
            ""
          ]
        },
        "skills": {
        },
        "classes": {
          "SRD": { },
          "custom": []
        },
        "stat_block": [ ],
        "inventory": {
          "equipment": [],
          "currency": {}
        },
        "spells": []
    };
    return product;

}

// response meta info
export interface responseType {
        "status": string,
        "msg": string,
        "owner": string,
        "permissions": number,
      }
