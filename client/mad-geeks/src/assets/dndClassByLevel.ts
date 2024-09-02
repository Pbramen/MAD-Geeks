
// data stored here is static and will not change over time.
const simple_weapons = [
    { name: "club", damage: "bludgeoning", roll: "1d4" },
    { name: "dagger", damage: "piercing", roll: "1d4" },
    { name: "greatclub", damage: "bludgeoning", roll: "1d8" },
    { name: "handaxe", damage: "slashing", roll: "1d6" },
    { name: "javelin", damage: "piercing", roll: "1d6" },
    { name: "light hammer", damage: "bludgeoning", roll: "1d4" },
    { name: "mace", damage: "bludgeoning", roll: "1d6" },
    { name: "quarterstaff", damage: "bludgeoning", roll: "1d6" },
    { name: "sickle", damage: "slashing", roll: "1d4" },
    { name: "spear", damage: "piercing", roll: "1d6" }
];


const martial_weapon = [
    "battleaxe",
    "flail",
    "glaive",
    "greataxe",
    "greatsword",
    "halberd",
    "lance",
    "longsword",
    "maul",
    "morningstar",
    "pike",
    "rapier",
    "scimitar",
    "shortsword",
    "trident",
    "war pick",
    "warhammer",
    "whip"
]
const two_handed = [
    "greataxe",
    "greatsword",
    "halberd",
    "lance",
    "maul",
    "pike",
    "two-handed sword"
]

const light_weapon = [
    "club",
    "dagger",
    "handaxe",
    "light hammer",
    "mace",
    "rapier",
    "scimitar",
    "shortsword",
    "sickle",
    "whip"
]

const heavy_weapon = [
    "greataxe",
    "greatsword",
    "halberd",
    "heavy crossbow",
    "lance",
    "maul",
    "pike",
    "two-handed sword"
]

const finese_weapon = [
    "dagger",
    "rapier",
    "scimitar",
    "shortsword"
]

// barbarian base rage pool
const ragePool =  [
    {
        quantity: 2,
        bonus: 2,
     }, // level 1
    {
        quantity: 2,
        bonus: 2
     }, // level 2
     {
        quantity: 3,
        bonus: 2
    }, // level 3
    {
        quantity: 3,
        bonus: 2
    }, // level 4
    {
        quantity: 3,
        bonus: 2
    }, // level 5
    {
        quantity: 4,
        bonus: 2
     }, // level 6
     {
        quantity: 4,
        bonus: 2
    }, // level 7
    {
        quantity: 4,
        bonus: 2
     }, // level 8
     {
        quantity: 4,
        bonus: 2
    }, // level 9
    {
        quantity: 4,
        bonus: 3
    }, // level 10
    {
        quantity: 4,
        bonus: 3
    }, // level 11
    {
        quantity: 4,
        bonus: 3
    }, // level 12
    {
        quantity: 5,
        bonus: 3
     }, // level 13
     {
        quantity: 5,
        bonus: 3
    }, // level 14
    {
        quantity: 5,
        bonus: 3
    }, // level 15
    {
        quantity: 5,
        bonus: 4
    }, // level 16
    {
        quantity: 6,
        bonus: 4
    }, // level 17
    {
        quantity: 6,
        bonus: 4
    }, // level 18
    {
        quantity: 6,
        bonus: 4
    }, // level 19
    {
        quantity: 999,
        bonus: 4
    }, // level 20
]
type die_rolls = '1d2' | '1d4' | '1d6' | '1d8' | '1d10' | '1d12' | '1d20';
export type ability_names = 'str' | 'con' | 'wis' | 'cha' | 'char' | 'dex' | 'int';
type level_range = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

export type AbilityScoreModelT = {
    abbr: ability_names,
    term: string, 
    description: string,
    example: string
}

export const ability_names_arr : ability_names[] = ['str', 'con', 'dex', 'wis', 'int', 'char'];
// Common order for displaying stats -> str, con, dex, wis, int, char
export const ability_score_model : AbilityScoreModelT[] = [
    {
        'abbr': 'str',
        'term': 'Strength',
        'description': "Measurement of one's athleticism and raw physical force. Affects damage and hit chance of martial weapons",
        'example': "How far can I throw an apple?"
    },
    {
        "abbr": "con",
        "term": "Constitution",
        "description": "Determines one's tenacity and endurance in battle. Affects charcter's max health",
        'example': " How many times can I hit this apple with a hammer?"
    },
    {
        "abbr": "dex",
        "term": "Dexterity",
        "description": "Speed, agility, and coordination. Affects turn order, hit change and damage of ranged and finese weapons.",
        'example': "If I threw an apple at you, can you catch and/or dodge it? "
    },
    {
        "abbr": "wis",
        "term": "Wisdom",
        "description": "Character's ability to critically think, rationalize, analyze, and plan. Determines how resistant you are against mental manipulation.  Affects spell casting for certain classes",
        "example": "What recipes can I make with this apple that would taste delicious?"
    },
    {
        "abbr": "int",
        "term": "Intelligence",
        "description": "Knowledge, memory, and awareness of various topics. Affects spell casting for wizards.",
        "example": "Can you identify this fruit is an apple?"
    },
    {
        "abbr": "char",
        "term": "Charisma",
        "description": "Ability to coerce others to follow your lead through your own wit or talents. Used in a variety of social settings, and bardic spell casting.",
        "example": "Can you sell this apple?"
    }
]
// this is for choices only!
export type Required_Select = {
    quantity: number[], // by level
    options: {id: string, descript: string}[], // note: as of now, this will not reflect changes to equipment.
}

// for features that require resource managment
export type Resource_Pool = {
    quantity: number,           // number of uses before long/short rest
    bonus?: number,             // other unspecified bonus type (use for flat addition)
    die_roll?: die_rolls        // quality of roll
}

type Feature_Descript = {
    unlockedBy: level_range,
    name: string,
    description: string,
    pool?: Resource_Pool[],                 // length of 20 (per level)
    required_options?: Required_Select      // prompts the user to select an option if feature has options
}
const fighting_styles: {id: string, descript: string}[]= [
    { id: '--', descript: "Add a custom style later" },
    { id: 'Archery', descript: "+2 to attack rolls on ranged weapons" },
    { id: 'Defense', descript: '+1 bonus to AC while wearing armor' },
    { id: 'Dueling', descript: '+2 bonus to damage rolls when equiped with one weapon' },
    { id: 'Great Weapon Fighting', descript: 'Reroll damage die if you roll a 1 or 2 when a two-handed or versatile weapon' },
    { id: 'Protection', descript: "Impose disadvantage when a creature(A) in line-of-sight attacks another creature(B) within 5 feet of you." },
    { id: 'Two-Weapon Fighting', descript: 'You can add ability modifier to the damage of the second attack.'}]
    

export interface classSpecifics {
    img: string,
    recommended_stats: ability_names[],
    description?: string,
    proficiency: {
        equipment: string[],
        skills: string[],
        saving: ability_names[]
    },
    resources: {
        hit_dice: '1d4' | '1d6' | '1d8' | '1d10' | '1d12',
        class_features: Feature_Descript[],
        spells?: {
            availableSpells: string[][],    // list of spells avaliable per level
            spellsKnown: number[],          // number of prepared spells 
            spellSlotsPerLevel: number[][]  // spell slots per level
        }
    }
}

const musical_instrument = [
    "drum",
    "dulcimer",
    "flute",
    "lute",
    "lyre",
    "horn",
    "pan flute",
    "shawm",
    "violin"
]

const barbarian: classSpecifics = {
    img: 'img/helmet.png',
    description: "Relentless and reckless melee warrior! Enter a battle rage and overwhelm your foes with mighty strength!",
    recommended_stats: ["str", "con", "dex"],
    proficiency: {
        equipment: [
            "light armor",
            "medium armor",
            "shields",
            "simple weapons",
            "martial weapons"
        ],
        skills: [
            "Animal Handling",
            "Athletics",
            "Intimidation",
            "Nature",
            "Perception",
            "Survival"
        ],
        saving: ["str", "con"]
    },
    resources: {
        hit_dice: "1d12",
        class_features: [
            {
                name: "Rage",
                unlockedBy: 1,
                description: "You can enter a rage as a bonus action. While raging, you gain a bonus to damage with Strength-based attacks, advantage on Strength checks and saves, and resistance to bludgeoning, piercing, and slashing damage.",
                pool: ragePool
            },
            {
                name: "Unarmored Defense",
                unlockedBy: 1,
                description: "While not wearing armor or wielding a shield, your AC equals 10 + your Dexterity modifier + your Constitution modifier."
            },
            {
                name: "Reckless Attack",
                unlockedBy: 2,
                description: "When you make your first attack on your turn, you can choose to attack recklessly, giving you advantage on melee weapon attack rolls using Strength, but attack rolls against you have advantage until your next turn."
            },
            {
                name: "Danger Sense",
                unlockedBy: 2,
                description: "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells, as long as you are not blinded, deafened, or incapacitated."
            },
            {
                name: "Primal Path",
                unlockedBy: 3,
                description: "You choose a Primal Path which grants additional features at levels 3, 6, 10, and 14. Each path offers unique abilities."
            },
            {
                name: "Extra Attack",
                unlockedBy: 5,
                description: "Gain addtitional attack(s) whenever you take the Attack action on your turn.",
            },
            {
                name: "Fast Movement",
                unlockedBy: 5,
                description: "Your speed increases by 10 feet while you are not wearing heavy armor."
            },
            {
                name: "Feral Instinct",
                unlockedBy: 7,
                description: "You have advantage on initiative rolls, and you can act normally on a surprise round, provided you aren't incapacitated."
            },
            {
                name: "Brutal Critical",
                unlockedBy: 9,
                description: "You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack."
            },
            {
                name: "Relentless Rage",
                unlockedBy: 11,
                description: "If you drop to 0 hit points while raging, you can make a DC 10 Constitution saving throw to drop to 1 hit point instead."
            },
            {
                name: "Persistent Rage",
                unlockedBy: 15,
                description: "Your rage lasts until you have no more uses left, you fall unconscious, or you end it voluntarily (no longer requires a concentration check)."
            },
            {
                name: "Indomitable Might",
                unlockedBy: 18,
                description: "If your total for a Strength check is less than your Strength score, you can use that score in place of the total."
            },
            {
                name: "Primal Champion",
                unlockedBy: 20,
                description: "Your Strength and Constitution scores increase by 4, up to a maximum of 24. Your hit points increase by 40."
            }
        ]
    }
};

const fighter: classSpecifics = {
    img: 'img/helmet.png',
    description: "A well-balanced martial combatant, skilled in a variety of weapons, armor, and shields! Can quickly pick up new abilities or quickly upgrade ability score.",
    recommended_stats: ["str", "con", "dex"],
    proficiency: {
        equipment: [
            "light armor",
            "medium armor",
            "heavy armor",
            "shields",
            "simple weapons",
            "martial weapons"
        ],
        skills: [
            "Acrobatics",
            "Animal Handling",
            "Athletics",
            "History",
            "Insight",
            "Perception"
        ],
        saving: ["str", "con"]
    },
    resources: {
        hit_dice: "1d10",
        class_features: [
            {
                name: "Fighting Style",
                unlockedBy: 1,
                description: "You adopt a particular style of fighting as your specialty, choosing from options like Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.",
                required_options: {
                    quantity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2], 
                    options: fighting_styles,
                },
            },
            {
                name: "Second Wind",
                unlockedBy: 1,
                description: "As a bonus action, you can regain hit points equal to 1d10 + your fighter level. You can use this feature once per short or long rest."
            },
            {
                name: "Action Surge",
                unlockedBy: 2,
                description: "You can push yourself beyond your normal limits for a moment, giving you one additional action on your turn. You can use this feature once per short or long rest."
            },
            {
                name: "Martial Archetype",
                unlockedBy: 3,
                description: "You choose a Martial Archetype, which grants additional features at levels 3, 7, 10, 15, and 18. Each archetype offers unique abilities.",
                
            },
            {
                name: "Extra Attack",
                unlockedBy: 5,
                description: "Gain addtitional attack(s) whenever you take the Attack action on your turn.",
                pool: [
                    { quantity: 0 }, { quantity: 0 }, { quantity: 0 }, { quantity: 0 },
                    { quantity: 1 }, { quantity: 1 }, { quantity: 1 }, { quantity: 1 }, { quantity: 1 }, { quantity: 1 }, 
                    { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 }, { quantity: 2 },
                    { quantity: 3 }
                ]
            },
            {
                name: "Indomitable",
                unlockedBy: 9,
                description: "You can reroll a failed saving throw. You must use the new roll. You can use this feature once per long rest."
            },
            {
                name: "Improved Critical",
                unlockedBy: 10,
                description: "Your weapon attacks score a critical hit on a roll of 19 or 20."
            },
            {
                name: "Remarkable Athlete",
                unlockedBy: 13,
                description: "You gain proficiency in the Acrobatics or Athletics skill if you are not already proficient, and you can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn’t already use your proficiency bonus."
            },
            {
                name: "Superior Defense",
                unlockedBy: 18,
                description: "You gain proficiency with all saving throws. Additionally, you can use your reaction to add +2 to your saving throw against an effect that requires a saving throw."
            },
            {
                name: "Survivor",
                unlockedBy: 20,
                description: "You regain hit points at the start of your turn if you have less than half of your hit points remaining. You regain hit points equal to 5 + your Constitution modifier."
            }
        ]
    }
}

const bard: classSpecifics = {
    img: 'img/lute.png',
    recommended_stats: ["cha", "dex", "con"],
    description: "A caster that utilizes the power of words, songs, or music to captivise (or harm) their audience! Excells in social skills.",
    proficiency: {
        equipment: [
            "light armor",
            "simple weapons",
            "hand crossbows",
            "longswords",
            "rapiers",
            "shortswords"
        ],
        skills: [
            "Acrobatics",
            "Animal Handling",
            "Arcana",
            "Athletics",
            "Deception",
            "History",
            "Insight",
            "Intimidation",
            "Investigation",
            "Medicine",
            "Nature",
            "Perception",
            "Performance",
            "Persuasion",
            "Religion",
            "Sleight of Hand",
            "Stealth",
            "Survival"
        ],
        saving: ["dex", "cha"]
    },
    resources: {
        hit_dice: '1d6',
        class_features: [
            {
                name: "Bardic Inspiration",
                unlockedBy: 1,
                description: "You can use a bonus action to inspire others, granting them an extra d6 on ability checks, attack rolls, or saving throws."
            },
            {
                name: "Jack of All Trades",
                unlockedBy: 2,
                description: "Add half your proficiency bonus to any ability check you make that doesn't already include your proficiency bonus."
            },
            {
                name: "Song of Rest",
                unlockedBy: 2,
                description: "You can use soothing music or oration to help revitalize your wounded allies during a short rest."
            },
            {
                name: "Countercharm",
                unlockedBy: 6,
                description: "You can use your action to grant yourself and your allies advantage on saving throws against being frightened or charmed for 1 minute."
            },
            {
                name: "Magical Secrets",
                unlockedBy: 10,
                description: "You can learn two spells from any class's spell list, and they count as bard spells for you."
            },
            {
                name: "Superior Inspiration",
                unlockedBy: 20,
                description: "If you roll initiative and have no uses of Bardic Inspiration left, you regain one use."
            }
        ],
        spells: {
            availableSpells: [
                ["Vicious Mockery", "Prestidigitation", "Mage Hand"],
                ["Cure Wounds", "Dissonant Whispers", "Faerie Fire", "Tasha's Hideous Laughter"],
                ["Leomund's Tiny Hut", "Major Image"],
                ["Greater Invisibility", "Polymorph"],
                ["Modify Memory", "Dream"],
                ["Foresight", "Power Word Heal"]
            ],
            spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 17, 18, 19, 19, 20, 22, 22, 22],
            spellSlotsPerLevel: [
                [2, 2, 0, 0, 0, 0, 0, 0, 0, 0], // class level 1
                [2, 3, 0, 0, 0, 0, 0, 0, 0, 0], // class level 2
                [2, 4, 2, 0, 0, 0, 0, 0, 0, 0], // class level 3
                [3, 4, 3, 0, 0, 0, 0, 0, 0, 0], // class level 4
                [3, 4, 3, 2, 0, 0, 0, 0, 0, 0], // class level 5
                [3, 4, 3, 3, 0, 0, 0, 0, 0, 0], // class level 6
                [3, 4, 3, 3, 1, 0, 0, 0, 0, 0], // class level 7
                [3, 4, 3, 3, 2, 0, 0, 0, 0, 0], // class level 8
                [3, 4, 3, 3, 3, 0, 0, 0, 0, 0], // class level 9
                [4, 4, 3, 3, 3, 1, 0, 0, 0, 0], // class level 10
                [4, 4, 3, 3, 3, 2, 0, 0, 0, 0], // class level 11
                [4, 4, 3, 3, 3, 3, 0, 0, 0, 0], // class level 12
                [4, 4, 3, 3, 3, 3, 1, 0, 0, 0], // class level 13
                [4, 4, 3, 3, 3, 3, 2, 0, 0, 0], // class level 14
                [4, 4, 3, 3, 3, 3, 3, 0, 0, 0], // class level 15
                [4, 4, 3, 3, 3, 3, 3, 1, 0, 0], // class level 16
                [4, 4, 3, 3, 3, 3, 3, 2, 0, 0], // class level 17
                [4, 4, 3, 3, 3, 3, 3, 3, 0, 0], // class level 18
                [4, 4, 3, 3, 3, 3, 3, 3, 1, 0], // class level 19
                [4, 4, 3, 3, 3, 3, 3, 3, 2, 0], // class level 20
            ]
        }
    }
};

// file contains data to be used for display during character creation. 
export const class_data: {[key:string]: classSpecifics} = {
    barbarian: barbarian,
    bard: bard,
    fighter: fighter,
}