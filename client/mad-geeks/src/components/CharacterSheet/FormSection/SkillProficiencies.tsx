import React, {  SetStateAction, useEffect, useState } from 'react';
import { ProficiencyChoicesPayload } from 'ts/interface/response.interface';

type SkillChoicesT = {
    choices: ProficiencyChoicesPayload,
    selectedSkills: Set<string>,
    setSelectedSkills: React.Dispatch<SetStateAction<Set<string>>>,
}

export const SkillProficiencies = ({ choices, selectedSkills, setSelectedSkills }: SkillChoicesT) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    
    const isChecked = (name: string) => {
        return selectedSkills.has(name);
    }


    // NOTE: THIS RUNS BEFORE SETTING CHECKED
    const manageLimit = (e: React.ChangeEvent) => {
        e.stopPropagation();
        const limit = choices.choices || 0;
        const target = e.currentTarget as HTMLInputElement;
        if (target.checked && selectedSkills.size < limit) {
            if (selectedSkills.size === limit - 1) {
                setDisabled(true);
            }
            setSelectedSkills(prev => { 
                prev.add(target.name);
                return prev;
            })
        }
        if (target.checked === false && selectedSkills.has(target.name)) {
            setDisabled(false);
            setSelectedSkills(prev => {
                prev.delete(target.name);
                return prev
            })
        }
    }
    
    const parentClick = () => {
        console.log("parent was clicked.")
    }
    const list = choices.result.map((e, i) => {
        const checkboxId = e.name + '_id_cb'
        return (
            <div key={`prof_${e.index}`} className='flex hztl-border' onClick={parentClick}>
                <input
                    id={checkboxId}
                    type='checkbox'
                    name={e.name}
                    onChange={manageLimit}
                    defaultChecked={isChecked(e.name)}
                    disabled = {!isChecked(e.name) && disabled}
                />
                <label htmlFor={checkboxId} className='centered-block' >{e.name}</label>
            </div>
        )
    })
    return (
        <div>
            <div>
                For {choices.name} - please select up to {choices.choices} skills to gain proficiency bonus in. 
            </div>
            <div className='flex flex-row flex-wrap sm-margin-top'>
                {list}
            </div>
        </div>

    )
    
}