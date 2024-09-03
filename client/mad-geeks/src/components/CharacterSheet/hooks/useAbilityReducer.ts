import { abilityScoreReducer, ABStateT } from "state/CharacterSheetReducer";
import { useReducer } from 'react';

export const useAbilityReducer =  () => {
    const [stats, dispatcher] = useReducer(abilityScoreReducer, {
        stats: ['--', '--', '--', '--', '--', '--'],
        pattern: "standard",
        randomABSOptions: {
            results:
                [{ stats: [], minIndex: 0, total: 0 }],
            optionsLeft: [0, 0, 0, 0, 0, 0],
        },
        standardOptions: {
            trackOptions: {'--': -1, '15': -1, '14': -1, '13': -1, '12': -1, '10': -1, '8': -1},
            trackOptionsByIndex:  ['--', '--', '--', '--', '--', '--']
        }
    })

    if (stats === undefined || dispatcher === undefined) {
        console.error("abilityScoreReducer is out of scope at useAbilityReducer.ts");
    }
    return {stats, dispatcher}
}