// data stored here is static and will not change over time.
const simple_weapons= [
    "club",
    "dagger",
    "greatclub",
    "handaxe",
    "javelin",
    "light hammer",
    "mace",
    "quarterstaff",
    "sickle",
    "spear"
]

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

const barbarian = {
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
        hit_dice: "d12",
        class_features: [
            {
                name: "Rage",
                unlockedBy: 1,
                description: "You can enter a rage as a bonus action. While raging, you gain a bonus to damage with Strength-based attacks, advantage on Strength checks and saves, and resistance to bludgeoning, piercing, and slashing damage."
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
                description: "You can attack twice, instead of once, whenever you take the Attack action on your turn."
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
        ],
        spells: {
            avaliableSpells: [
                [], // Barbarian doesn't cast spells
                []
            ],
            cantrips: [],
            spellSlots: [[]],
            preparedSpells: [[]]
        }
    }
    }

const fighter = {
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
        hit_dice: "d10",
        class_features: [
            {
                name: "Fighting Style",
                unlockedBy: 1,
                description: "You adopt a particular style of fighting as your specialty, choosing from options like Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting."
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
                description: "You choose a Martial Archetype, which grants additional features at levels 3, 7, 10, 15, and 18. Each archetype offers unique abilities."
            },
            {
                name: "Extra Attack",
                unlockedBy: 5,
                description: "You can attack twice, instead of once, whenever you take the Attack action on your turn."
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
                name: "Additional Fighting Style",
                unlockedBy: 15,
                description: "You can choose a second Fighting Style."
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
        ],
        spells: {
            avaliableSpells: [
                [], // Fighter doesn't cast spells
                []
            ],
            cantrips: [],
            spellSlots: [[]],
            preparedSpells: [[]]
        }
    }
};

const bard = {
    recommended_stats: ["cha", "dex", "con"],
    proficiency: {
        equipment: [
            "Light armor",
            "Simple weapons",
            "Hand crossbows",
            "Longswords",
            "Rapiers",
            "Shortswords"
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
                [3, 4, 2, 0, 0, 0, 0, 0, 0, 0], // class level 4
                [3, 4, 3, 2, 0, 0, 0, 0, 0, 0], // class level 5
                [3, 4, 3, 3, 0, 0, 0, 0, 0, 0], // class level 6
                [3, 4, 3, 3, 1, 0, 0, 0, 0, 0], // class level 7
                [3, 4, 3, 3, 2, 0, 0, 0, 0, 0], // class level 8
                [3, 4, 3, 3, 1, 0, 0, 0, 0, 0], // class level 9
            ]

        }
    }
};

// file contains data to be used for display during character creation. 
export const class_data = {
    barbarian: barbarian,
    bard: bard,
    fighter: fighter,


}