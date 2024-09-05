// import types 
import {
    dieResults,
    AbilityScoreT,
    IncrementP,
    ResetP,
    RecommendP,
    UpdateP,
    GenerateOptionsP,
    AbilityScoreAction,
    PatternT,
    AbilityScoreActions
} from 'components/CharacterSheet/model';
// array of names of ability score
import { ability_names_arr } from 'assets/dndModel';


export type ABStateT = {
    stats: AbilityScoreT,
    pattern: PatternT,
    randomABSOptions: {
        results: dieResults[] | null,
        optionsLeft: number[],
    },
    standardOptions: {
        trackOptions: { [key: string]: number },
        trackOptionsByIndex: string[]
    }
}

const minInt = (min: number) => (value: number) => {
    return min <= value;
}

const maxInt = (max: number) => (value: number) => {
    return max >= value;
}
const ability_score = ['--', ...ability_names_arr];
    
const dispatcher = {
    buy: {
        base: [8, 8, 8, 8, 8, 8],
        options: [8, 8, 8, 8, 8, 8]
    },
    // [str, con, dex, wis, int, char]
    standard:  {
        bard: [8, 12, 14, 13, 10, 15],
        barbarian: [15, 14, 13, 8, 10, 12],
        fighter: [15, 14, 13, 10, 12, 8],
        wizard: [8, 14, 10, 12, 15, 13],
        sorcerer: [8, 14, 10, 12, 13, 15],
        warlock: [8, 14, 10, 12, 13, 15],
        rogue: [8, 12, 15, 13, 10, 14],
        ranger: [10, 14, 15, 12, 13, 8],
        base: ['--', '--', '--', '--', '--', '--'], // fallback
        options: new Set([15, 14, 13, 12, 10, 8])
    }, 
    roll: {
        base: ['--', '--', '--', '--', '--', '--'], 
        options: ['--', '--', '--', '--', '--', '--']
    }
}

export const abilityScoreReducer = (state:  ABStateT, action: AbilityScoreAction) : ABStateT => {
    // prevent state from changing 
    const validateMin = minInt(8);
    const validateMax = maxInt(15);

    let p = state.pattern;
    const LUT_actions = {
        'add': {
            update: (() => {
                const a = action as IncrementP;
                const score = state.stats as number[];
                if (!validateMax(a.amount + score[a.index])) return state;
                return {
                    ...state, stats: (score.map((e, i) => { return i === a.index ? a.amount + score[a.index] : e }))
                }
            })
        },
        'subtract': {
            update: (() => {
                const a = action as IncrementP;
                const score = state.stats as number[];
                if (!validateMin(score[a.index] - a.amount)) return state;
                return {
                    ...state, stats: (score.map((e, i) => { return i === a.index ? score[a.index] - a.amount : e }))
                }
            })
        },
        // manual reset button
        'reset': { 
            update: () => {
                const a = action as ResetP;
                if (p === 'standard') {
                    return { ...state, stats: dispatcher[p][a.field || 'barbarian'], pattern: p }
                }
                return { ...state, stats: dispatcher[p]['base'], pattern: p }
            }
        },
        // on page switch or hitting the reset button 
        'swap': {
            update: () => {
                const a = action as ResetP;
                p = a.pattern;
                return {
                    ...state,
                    standardOptions: {
                        trackOptions: { '--': -1, '15': -1, '14': -1, '13': -1, '12': -1, '10': -1, '8': -1 },
                        trackOptionsByIndex: ['--', '--', '--', '--', '--', '--']
                    },
                    randomABSOptions: {
                        stats: [],
                        optionsLeft: dispatcher[p].options
                    },
                    stats: dispatcher[p]['base'],
                    pattern: p
                }
            }
        },
        'recommend': {
            update: () => {
                const a = action as RecommendP
                return { ...state, stats: dispatcher[p][a.field], pattern: p }
            }
        },
        'update_array': {
            update: () => {
                const a = action as UpdateP;

                let newTrackOption = { ...state.standardOptions.trackOptions, [a.oldValue]: -1, [a.newValue]: a.index }
                let newTrackOptionByIndex = state.standardOptions.trackOptionsByIndex.map((e, i) => {
                    if (i === a.index) return a.newValue;
                    return e;
                })

                return {
                    ...state, 

                    stats: state.stats.map((e, i) => {
                        if (i === a.index) 
                            return a.newValue.toString();
                        return e;
                    }),
                    standardOptions: {
                        ...state.standardOptions,
                        trackOptions: newTrackOption,
                        trackOptionsByIndex: newTrackOptionByIndex
                    }
                }

            }
        },
        'generate_and_save_options': {
            update: () => {
                const a = action as GenerateOptionsP;
                // reset the options to empty / not yet picked
                return { ...state, randomABSOptions: {...state.randomABSOptions, stats: a.options, optionsLeft: [0, 0, 0, 0, 0, 0]} }
            }
        },
        'update_without_swapping': {
            update: () => {
                const a = action as UpdateP;
                const score = state.stats as number[] | string[]
                const ab_index = ability_score.indexOf(a.ability_name) - 1;

                var random = {... state.randomABSOptions};
                // given the new index, change the stats
                if (a.pattern === 'roll') {
                    random = {
                        ...state.randomABSOptions, optionsLeft: state.randomABSOptions.optionsLeft.map((e, i) => {
                            // set which options have been picked. if 0, no stat was allocated yet.
                            if (i === a.index)
                                return ability_score.indexOf(a.ability_name);
                            // return i === ability_score.indexOf(a.ability_name) - 1 ?  : e;
                            return e;
                    })}
                }
                return {
                    ...state, stats: score.map((e: number | string, i: number) => {
                        if (ab_index !== -1 && ab_index === i) {
                            return a.newValue as number;
                        }
                        return e; 
                    }
                    ), 
                    randomABSOptions: random
                }
            }
        }
    }

    const actionState = LUT_actions[action.type];
    if (actionState) {
        return actionState?.update();
    }
    console.error("Invalid action state for abilityScoreReducer: ", action.type);
    return state;
}
