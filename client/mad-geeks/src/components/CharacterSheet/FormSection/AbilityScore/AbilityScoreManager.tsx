import React, {Dispatch, SetStateAction} from 'react';
// Types
import { AbilityScoreAction, AbilityScoreActions, PatternT } from '../../model';
import { ABStateT } from 'components/CharacterSheet/state/AbilityScoreDispatcher';
import { ProficiencyChoicesResSchema } from 'ts/interface/response.interface';

// custom hooks
import { useABSModel } from '../../hooks/useABSModel'; 

// Reusable Components
import { FieldSet } from 'components/FieldSet';
import { SwitchTabs } from 'components/SwitchTabs';
import { SkillProficiencies } from '../SkillProficiencies';

export const getMaxKeyByValue = (classes: { [key: string]: number }) => {
    let max = Number.MIN_SAFE_INTEGER; 
    let maxKey = '';
    Object.entries(classes).forEach(([key, value]) => {
        const criteria = value > max && value > 0;
        maxKey = criteria ? key : maxKey;
        max = criteria ? value : max;
    })
    return maxKey;
}

type StateManagerT = {
    classes: {
        [key: string]: number
    },
    state: ABStateT,
    setStats: React.Dispatch<AbilityScoreAction>,
    onHelperClick: React.MouseEventHandler,
    classProficencies: ProficiencyChoicesResSchema | {},
    selectedSkills: Set<string>,
    setSelectedSkills: React.Dispatch<SetStateAction<Set<string>>>,
    onNoSetClassClick: React.MouseEventHandler
}

// parent component that soley handles state management system for point allocation system.
export const StateManger = ({ classes, state, setStats, onHelperClick, classProficencies, selectedSkills, setSelectedSkills, onNoSetClassClick }: StateManagerT) => {
    const mainClass = getMaxKeyByValue(classes);
    const patterns = useABSModel(mainClass, state, setStats);

    // switch the point allocation method and reset the stats
    const onClickHandler = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        setStats({ type: 'swap', pattern: target.name as PatternT, field: mainClass })
    }   
  
    return (
        <div id="stat-page">
            <div onClick={onHelperClick} className="summary-wrapper">
                <img src="img/help_icon.png" width="27px" height="27px" alt="Help icon"/>
                <div className="inline-btn">Summary of Each Stat</div>
            </div>
            <FieldSet toggle={true} state='' path='' legend_title='Ability Score' description="Set your character stats here!">
                <SwitchTabs pattern={patterns} selected={state.pattern} onClickHandler={onClickHandler} />    
                    {patterns[state.pattern]?.element || "Comming soon!"}
            </FieldSet>
            <FieldSet toggle={true} state='' path='' legend_title='Skill Proficiencies' description="Select your starting skill proficiencies!">
                {
                    mainClass !== '' ?
                        <SkillProficiencies choices={classProficencies[mainClass]} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} /> :
                        <button type='button' className='inline-btn' onClick={ onNoSetClassClick }>Please select a class first!</button>
                }
            </FieldSet>
        </div>
    )
}