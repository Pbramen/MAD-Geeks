import React, {useState} from 'react';
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
    setStats: React.Dispatch<AbilityScoreAction>,
    onHelperClick: React.MouseEventHandler
}

// parent component that soley handles state management system for point allocation system.
export const StateManger = ({ classes, state, setStats, onHelperClick }: StateManagerT) => {
    const mainClass = getMaxKeyByValue(classes);
    const patterns = useABSModel(mainClass, state, setStats);


    // switch the point allocation method and reset the stats
    const onClickHandler = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        setStats({ type: 'swap', pattern: target.name as PatternT, field: mainClass })
    }   
  
    return (
        <>
            <div onClick={onHelperClick} className="summary-wrapper">
                <img src="img/help_icon.png" width="27px" height="27px" alt="Help icon"/>
                <div className="inline-btn">Summary of Each Stat</div>
            </div>
            <FieldSet toggle={true} state='' path='' legend_title='Ability Score' description="Set your character stats here!">
                <SwitchTabs pattern={patterns} selected={state.pattern} onClickHandler={onClickHandler} />    
                    {patterns[state.pattern]?.element || "Comming soon!"}
            </FieldSet>
        </>
    )
}