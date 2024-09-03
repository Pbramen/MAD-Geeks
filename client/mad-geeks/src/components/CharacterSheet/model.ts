export type dieResults = { stats: number[], minIndex: number, total: number }

/* ------------- Types for Character Form State ------------- */
export type AbilityScoreT = number[] | string[]

// different parameters for useReducer 
export type IncrementP = { type: AbilityScoreActions, index: number, amount: number };
export type ResetP = { type: 'reset' | 'swap', pattern: PatternT, field?: string };
export type RecommendP = { type: 'recommend', pattern?: 'buy', class: string, field: string };
export type UpdateP = { type: 'update_array' | 'update_without_swapping', pattern: 'standard' | 'roll', newValue: number | string, index: number, ability_name?: string, oldValue?: string}
export type GenerateOptionsP = { type: 'generate_and_save', options: dieResults[] }

export type AbilityScoreAction = IncrementP | ResetP | RecommendP | UpdateP | GenerateOptionsP
export type PatternT = "buy" | "standard" | "roll";
export type AbilityScoreActions = 'add' | 'subtract';
/* -------------           END           ------------- */


