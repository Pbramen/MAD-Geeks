import { ABStateT } from "state/CharacterSheetReducer";
import { dieResults } from "components/CharacterSheet/model";

import { ability_names_arr } from "assets/dndModel";

import React, { useEffect, useRef } from 'react';

import { UniqueSelector } from "components/CustomInput";

export const RollLayoutPage = ({ children, onClickerHandler }) => {
    return (
        <div className="flex flex-column">
            <h2>Roll for Random Stats!</h2>
            <span>
                Rules: For each stat, roll a 4d6 (6-sided dice 4 times) and drop the lowest value. The remaining 3 dice will determine the result for a single stat.
                Then select whichever stat you want to assign the total result to!
            </span>
            <button className="btn-1 btn-xl" type="button" style={{ maxWidth: '100px', margin: '40px'}} onClick={onClickerHandler}>Roll 4d6</button>
            <div className="flex flex-row" style={{ minWidth: '80%', minHeight: "200px", flexWrap: 'wrap', justifyContent: 'center'}}>
                {children}
            </div>
            </div>
    )
}

export const  generateRollDisplay = (generateSelectOptions, state, path, d6, onChange)=> {
    if (state && state.randomABSOptions && state.randomABSOptions.stats && state.randomABSOptions.stats.length === 6) {
        return state.randomABSOptions.stats.map((row: dieResults, x: number) => {
            const total = row.total - row.stats[row.minIndex];
            const id = `res_table_${x}`;
            return (
                <div className="flex flex-column centered card-2" key={`result_wrapper_${x}`}>
                    <label htmlFor={id} className='display-stat'><strong>{total}</strong></label>
                    <div className="flex flex-row" style={{ flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                        {
                            row.stats.map((result, y) => {
                                const id = `_${x}_${y}_img`;
                                return <div className="flex flex-column" key={id}>
                                    <img className={`${y === row.minIndex ? "disabled-opacity " : ''}`} id={id} src={path + d6[result - 1]} width={30} alt={'1d6 dice icon with result of ' + result.toString()} />
                                    <label className={`${y === row.minIndex ? "disabled-opacity " : ''}`} htmlFor={id}>{result.toString()}</label>
                                    
                                </div>
                            })
                        }
                    </div>
                    <div style={{ minWidth: "200px" }}>
                        <label htmlFor={id} style={{ fontSize: '0.7em' }}>Select an Ability</label>
                        {generateSelectOptions(x, total, id)}
                    </div>
                </div>
            )
        })
    }
    return <></>    
}

// row length includes header!
const StatsTable = ({ children, col_length, row_length }: {children: React.ReactNode, col_length: number, row_length: number}) => {
    const gridContainer: React.MutableRefObject<HTMLDivElement> = useRef(null);
    useEffect(() => {
        gridContainer.current.style.gridTemplateColumns = `repeat(${col_length}, 1fr)`;
        gridContainer.current.style.gridTemplateRows = `repeat(${row_length}, 1fr)`
    }, [col_length, row_length])
    
    return (
        <div ref={gridContainer} className="point-grid" >
            {children}
        </div>
    )
}



type ScoreTableStructT = {
    children: React.ReactNode,
    disabledCost?: boolean // Disabled last column 
}
// resuable component for headers for ability scores. 
export const ScoreTableStructure = ({children, disabledCost=false} : ScoreTableStructT) : React.ReactNode => {
    // 8 rows => 1 header, 1 footer, and 6 ability scores.
    var col_len = 6
    if (disabledCost) {
        col_len -= 1;
    }
    return (
        <StatsTable col_length={col_len} row_length={8}>
            <h2>Ability</h2>
            <h2>Score</h2>
            <h2>Bonus</h2>
            <h2>Modifier</h2>
            <h2>Total</h2>
            {!disabledCost && <h2>Cost</h2>}
            {children}
        </StatsTable>
        )
}


export const CharacterScoreTable = ({ onChangeHandler, state }: { onChangeHandler: any, state: ABStateT}) => {    
    const list =
        ability_names_arr.map((e, i) => {
            var options = new Set(['--', 15, 14, 13, 12, 10, 8]);
            const onChange = onChangeHandler(i);
            const currentValue = state.stats[i]
            const modifer = Number.isInteger(currentValue) ? Math.floor((currentValue as number - 10) / 2) : '--';
           
            // filter out the options that arn't needed. 
            for (let j = 0; j < 6; j++){
                let x = state.standardOptions.trackOptionsByIndex[j];
                if (j !== i && x !== '--' ) {
                    let y = parseInt(x);
                    options.delete(y);
                }
            }

            return (
                <React.Fragment key={e + i}>
                <label htmlFor={e + "_value"}>{e.toUpperCase()}</label>
                <UniqueSelector onChangeHandler={onChange} options={options} identity={e} value={state.stats[i]} /> 
                
                <span>+0</span>
                <span>{modifer}</span>
                <span>{state.stats[i]}</span>
                <span>{ }</span>
            </React.Fragment>
            )
        })

    return (
        <ScoreTableStructure>
            {list}
        </ScoreTableStructure>
    )
}
