const path = require("path");
const { CustomValidatorError } = require(path.resolve(__dirname, "../../errorhandling/ValidationError"));

class Request_Body_Validator {
    // contains the last known validation error.
    error = null;
    obj; 
    constructor(obj) { 
        this.obj = obj;
        if (new.target === Request_Body_Validator) {
            console.log("Warnning: class is not meant for direct use.")
        }
    }
    
    /**
     * Validates the length of an array or string
     * @param {(Array | String)} test_obj 
     * @param {Number} minLen Minimum length of string or array
     * @param {Number} maxLen Maximum length of string or array
     * @returns {boolean} - True if length passes, false if length exceeds max and below min(capped to range 0 - 4096)
     */
    checkLength(test_obj, minLen = 0, maxLen = 4096) {
        const n = test_obj.length;

        minLen = minLen ? minLen > 0 : 0;
        maxLen = maxLen ? maxLen < 4096 : 4096;
        
        if (typeof test_obj === 'string' && (minLen > maxLen))
            throw new Error("Invalid use of checkString. Range of string must be between 0 and 4096.");
        return n >= minLen && n < maxLen && callback(str);
    }

    validate() {
        throw new Error("Invalid use case: Validate must be called from child component")
    }
}

class CharacterSheet_Validator extends Request_Body_Validator {
   
    constructor(obj) {
        super(obj);
    }

    // returns nothing if valid, else returns a json with all the errors...
    validate() {
        const req = new Set(["demographic", 'level', 'combat', 'skills', 'classes', 'stat_block', 'ability_feats']);
        const opt = new Set(["appearance", "traits", "background", "inventory", "spells"]);
        var invalid_fields = {}
        var validFields = this.check_Fields(this.obj, req, invalid_fields, opt );
        console.log(invalid_fields);
    }

    /**
     * Checks if object contains all required fields. Returns a set of all fields not listed in req or opt.
     * @param {Object} obj Object to compare
     * @param {Set} req Set of properties that are required.
     * @param {Set} opt Set of properties that are allowed, but not required. 
     * @returns {Set} Returns a list of all non-empty valid fields
     */
    check_Fields(obj, req, invalid_field, opt = new Set() ) {
        var result = new Set([]);
        if (!req instanceof Set) {
            throw new Error("Invalid use case: fields must be an Set type. Recieved ", typeof req);
        }
        if (!opt instanceof Set) {
            throw new Error("Invalid use case: opt must be Set type. Received ", typeof opt);
        }

        Object.keys(obj).forEach((key) => {
            if (req.has(key)) {
                result.add(key);
                req.delete(key);
            }
            else if (!opt.has(key)) {
                invalid_field[key]= "Missing Path"
            }
            else {
                result.add(key);
                req.delete(key);
            }
        })
        if (req.size > 0) {
            req.forEach(e => invalid_field[e] = "Missing Path"); // contains all missing fields
        }
        return result;
    }
    /**
     * @typedef {Object} Bonus
     * @property {boolean} proficiency - Indicates if skill/ability gains proficiency bonus
     * @property {boolean} expertise - If expertise was taken
     * @property {boolean} bonus - total from other bonuses. 
     */

    /**
    * @param { Bonus } obj - Object containing the embedded object of type bonus
    * @returns {Set} set containing all invalid fields. If empty, validation passes. 
   */
    checkBonuses() {
        return check_invalidFields(obj, new Set(["properties"]), new Set(["expertise", "bonus"]));
    }

    checkResourcePool() { 

    }
    
    checkWeight() {
        return check_invalidFields(this.obj, new Set([]))
    }
    checkInventory() {

    }
    checkRoll()  {

    }
    
    checkDemographic()  {
    
    }
    
    checkCombat()  {
    
    }
    
    checkSpells()  {
        
    }
    checkClasses()  { 
    
    }
    
}

const json_example = {

    
    "appearance": {
      "eyes": "string",
      "height": {
        "val": "string",
        "units": "ft"
      },
      "weight": {
        "val": "string",
        "units": "lbs"
      },
      "skin": "string",
      "hair": "string",
      "img": [
        "string"
      ],
      "other": {
        "name": "string",
        "value": "string"
      }
    },
    "traits": {
      "personality": "string",
      "ideals": "string",
      "bonds": "string",
      "flaws": "string",
      "alignment": 9
    },
    "background": {
      "backstory": "string",
      "allies": "string",
      "fraction": "string",
      "enemies": "string"
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
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        },
        "dex": {
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        },
        "con": {
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        },
        "int": {
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        },
        "wis": {
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        },
        "char": {
          "proficiency": true,
          "expertise": true,
          "bonus": 0
        }
      },
      "required": "string"
    },
    "skills": {
      "acrobatics": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "animal_handling": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "arcana": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "athletics": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "deception": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "history": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "insight": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "intimidation": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "investigation": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "medicine": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "nature": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "perception": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "performance": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "persuasion": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "religion": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "sleight_of_hand": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      },
      "survival": {
        "proficiency": true,
        "expertise": true,
        "bonus": 0
      }
    },
    "classes": {
      "SRD": {
        "barbarian": 3,
        "bard": 1
      },
      "custom": [
        {
          "name": "Custom_class",
          "value": 5
        },
        {
          "name": "other_class",
          "value": 1
        }
      ]
    },
    "stat_block": [
      {
        "base": 0,
        "bonuses": [
          {
            "src": "string",
            "value": 0
          }
        ]
      }
    ],
    "ability_feats": [
      {
        "name": "string",
        "obtained_at": 0
      }
    ],
    "inventory": {
      "equipment": [
        {
          "name": "string",
          "rarity": 0,
          "descript": "string",
          "roll": "Acid",
          "weight": {
            "value": 0,
            "units": "string"
          },
          "count": {
            "current": 0,
            "max": 0
          },
          "currency": {
            "electrium": 0,
            "platinum": 0,
            "gold": 0,
            "silver": 0,
            "copper": 0,
            "custom": [
              {
                "name": "string",
                "value": 0
              }
            ]
          }
        }
      ]
    },
    "spells": [
      {
        "official_SRD": "string",
        "name": "string",
        "component": "s",
        "school": "Abjuration",
        "descript": "string",
        "rollable": {
          "die": {
            "die": 1,
            "quantity": 100,
            "min_r": 0,
            "max_r": 0
          },
          "attack_roll": {
            "damage_type": "Acid",
            "status_effect": "string"
          },
          "saving_throw": {
            "base": 0,
            "stat": "str",
            "status_effect": "string"
          }
        },
        "range": {
                "value": 10,
                "shape": "cone"
            }
      }
    ]
}

const sheet = new CharacterSheet_Validator(json_example);
sheet.validate();