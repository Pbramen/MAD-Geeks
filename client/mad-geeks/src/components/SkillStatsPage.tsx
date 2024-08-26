// import React, { useState, useRef, useEffect, SetStateAction } from "react"
// import { FieldSet } from "./FieldSet"
// import { ability_score_model, ability_names } from "assets/dndClassByLevel"
// import { DynamicController } from "./CharacterSheet/DynamicController"

// // point map index NEEDS to be offset by 8 (this is the lowest you can go for point buy)
// const pointBuyMap = [0, 1, 2, 3, 4, 5, 7, 9]  

// const Ability_Score_Setup = ({control, errors, abilityState, setAbilityState, setAllocationState, allocationState}) => {
    
//     const stats = ['str', 'dex', 'con', 'wis', 'int', 'char'];
 
//     const getPointsLeft = (target = -1, index = -1) => {
//         return 27 - abilityState.reduce((acc: string, curr: string, i) => { 
//             var a = parseInt(acc);
//             var pointsSpent = 0;
//             if (i === index) {
//                 pointsSpent = pointBuyMap[target - 8];
//             }
//             else {
//                 pointsSpent = pointBuyMap[parseInt(curr) - 8];
//             }
//             return a + pointsSpent;
//         }, 0)
//     }

//     const [pointState, setPointState] = useState(() => { return getPointsLeft()});
    

//     const onChangeBuyHandler = (e, index) => {
//         const target = e.target as HTMLInputElement;
//         console.log("passing in index:", index);
//         const total = getPointsLeft(parseInt(target.value), index);
        
//         if (total < 0) {
//             console.log("exceeded total:", target.value, total)
//             return;
//         }
//         else {
//             setPointState(total); 
//             setAbilityState(prev => prev.map((e, i) => {
//                 return index === i ? target.value : e;
//             }))
//         }
//     }

//     const inputList = stats.map((e, index) => {
//         return (
//             <div className="flex flex-column centered" key = { index }>
//                 <label htmlFor={e}>{e.toUpperCase()}</label>
//                 <input min={8} max={15} type='number' placeholder="10" value={abilityState[index]} onChange={(e) => onChangeBuyHandler(e, index)} />
//             </div>
//         )
//     })

//     const switchRollState: React.MouseEventHandler = (e: React.MouseEvent) => {
//         const target = e.target as HTMLButtonElement;
//         if (target.id !== allocationState) {
//             // reset the stat values! 
//             setAllocationState(target.id);    
//         }
//     }
    
//     const helper = ability_score_model.map((e, index) => {
//         return (
//             <li key={index} >
//                 <span><strong style={{color: 'black'}}>{e.abbr}</strong> ({e.term}) - <span>{e.description}</span> </span>
//             </li>
//         )
//     })

//     return (
//         <>
//             {allocationState === 'buy' && <div>You have {pointState} points left!</div>}
//             <div className='flex flex-row centered'>
//                 <button id="standard" type="button" className={`btn-1 btn-xl ${allocationState === 'standard' ? 'btn-active': ""}`} onClick={switchRollState}>Standard Play</button>
//                 <button id="buy" onClick={switchRollState} className={`btn-1 btn-xl ${allocationState === 'buy' ? 'btn-active': ""}`}  type="button">Point Buy</button>
//                 <button id="roll" onClick={switchRollState} className={`btn-1 btn-xl ${allocationState === 'roll' ? 'btn-active': ""}`} type="button">Roll Die</button>
//             </div>
//             <p>
//                 [Insert description of roll option here...]            
//             </p>
//             <div className='flex flex-column centered' style={{gap: '20px'}}>
//                 <ul className='flex flex-row' style={{ float: "left", marginRight: "20px" }}>    
//                     { allocationState === 'buy' && inputList }
//                     { allocationState === 'standard' && <StandardArray list={stats} state={abilityState} setState={setAbilityState} />}
//                 </ul>
//                 <ul>
//                     {helper}
//                 </ul>
//             </div>

//         </>
//     )
    
// }
//  type SkillP = {
//     control: any,
//     errors: any,
//     sheetError: any,
//      abilityState: number[],
//      setAbilityState: any,
//      classState: any, 
//      classData: any,
//      allocationState: any,
//      setAllocationState: any
// }
// export const SkillStatsPage = ({ control, errors, sheetError, abilityState, setAbilityState, allocationState, setAllocationState, classState, classData} : SkillP ) => {
//     // grab all user picked classes
//     const list = Object.entries(classState).filter(([key, value]) => {
//         return value as number > 0;
//     }).map(([key, _], index) => {
//         return (
//             <li key={index}>
//                 {key.slice(0, 1).toUpperCase() + key.slice(1)}: {classData[key].recommended_stats.reduce((acc, current) => { return acc + ', ' + current }, '').slice(1)}
//             </li>
//         )
//     });
    
//     return (
//         <>
//             <FieldSet path="skills" state={sheetError} legend_title="Ability Score" description="Pick or Roll for your base stats!">
//                 <span>Recommended Stats: </span>
//                 <ul>
//                     {list}
//                 </ul>
//                 <Ability_Score_Setup control={control} errors={errors} abilityState={abilityState} allocationState={allocationState} setAllocationState={setAllocationState} setAbilityState={setAbilityState} />
//             </FieldSet>
//         </>
//     )
// }