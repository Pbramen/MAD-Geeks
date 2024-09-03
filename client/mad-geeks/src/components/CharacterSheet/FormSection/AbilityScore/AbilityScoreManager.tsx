import React from 'react';
// Types
import { AbilityScoreAction, AbilityScoreActions, PatternT } from '../../model';
import { ABStateT } from 'state/CharacterSheetReducer';

// custom hooks
import { useABSModel } from '../../hooks/useABSModel';
// Reusable Components
import { FieldSet } from 'components/FieldSet';
import { SwitchTabs } from 'components/SwitchTabs';

export const getMaxKeyByValue = (classes: { [key: string]: number }) => {
    let max = Number.MIN_SAFE_INTEGER; 
    let maxKey = '';
    Object.entries(classes).forEach(([key, value]) => {
        maxKey = value > max ? key : maxKey;
        max = value > max ? value : max;
    })
    return maxKey;
}

type StateManagerT = {
    classes: {
        [key: string]: number
    },
    state: ABStateT,
    setStats: React.Dispatch<AbilityScoreAction>
}

// parent component that soley handles state management system for point allocation system.
export const StateManger = ({ classes, state, setStats }: StateManagerT) => {
    const mainClass = getMaxKeyByValue(classes);
    const patterns = useABSModel(mainClass, state, setStats);
    
    // switch the point allocation method and reset the stats
    const onClickHandler = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        setStats({ type: 'swap', pattern: target.name as PatternT, field: mainClass })
    }

    return (
        
        <FieldSet toggle={true} state='' path='' legend_title='Ability Score' description="Baseline character stats that helps determine how likely a character will succeed! at specific tasks!">
            <SwitchTabs pattern={patterns} selected={state.pattern} onClickHandler={onClickHandler} />    
                {patterns[state.pattern]?.element || "Comming soon!"}
        </FieldSet>

    )
}