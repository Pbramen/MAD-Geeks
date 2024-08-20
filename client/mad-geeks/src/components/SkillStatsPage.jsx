import React, { useState } from "react"
import { FieldSet } from "./FieldSet"
import { ability_score_model, ability_names } from "assets/dndClassByLevel"
import { DynamicController } from "./CharacterSheet/DynamicController"



const StatsInputs = ({control, sheetErrors, errors }) => {
    const stats = ['str', 'dex', 'con', 'wis', 'int', 'char']
    const inputList = stats.map((e, index) => {
        return (
            
            <React.Fragment key={index}>
                <DynamicController
                    errors={errors}
                    state={sheetErrors}
                    name={e}
                    onChange={(e)=>{console.log(e)}}
                    control={control}
                    html="input"
                    type="number"
                    label={e.toUpperCase()}
                    path="skills.ability_score"
                />
            </React.Fragment>
        )
    })

    return (<>{inputList}</> )
}

const Ability_Score_Setup = ({control, errors, sheetError}) => {
    const [scoreOption, setScoreOptions] = useState("");

    return (
        <>
            <div>
                <button>Standard Play</button>
                <button>Point Buy</button>
                <button>Roll Die</button>
            </div>
            <p>
                [Insert description of roll option here...]            
            </p>
            <ul>
                <StatsInputs control={control} errors={errors} state={sheetError}/>
            </ul>

        </>
    )
    
}
export const SkillStatsPage = ({ control, errors, sheetError, classState, classData}) => {
    // grab all user picked classes
    const list = Object.entries(classState).filter(([key, value]) => {
        console.log(key, value);
        return value > 0;
    }).map(([key, _], index) => {
        console.log(key, classData[key])
        return (
            <li key={index}>
                {key.slice(0, 1).toUpperCase() + key.slice(1)}: {classData[key].recommended_stats.reduce((acc, current) => { return acc + ', ' + current }, '').slice(1)}
            </li>
        )
    });
    const helper = ability_score_model.map((e, index) => {
        return (
            <li key={index} >
                <span><strong style={{color: 'black'}}>{e.abbr}</strong> ({e.term}) - <span>{e.description}</span> </span>

            </li>
        )
    })
    return (
        <>
            <FieldSet legend_title="Ability Score" description="Pick or Roll for your base stats!">
                <span>Recommended Stats: </span>
                <ul>
                    {list}
                </ul>
                <Ability_Score_Setup control={control} errors={errors} sheetErrors={sheetError} />
                <div >
                    <ul>
                        {helper}
                    </ul>
                </div>
            </FieldSet>
        </>
    )
}