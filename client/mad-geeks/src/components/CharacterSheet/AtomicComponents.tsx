import React, { useState, useEffect, useRef } from 'react';
import { AbilityScoreAction, AbilityScoreActions, PatternT, ABStateT } from './CreateCharacter';
import { ability_names_arr, ability_score_model, class_data } from 'assets/dndClassByLevel';
import { FieldSet } from 'components/FieldSet';
import { ToggleTab } from 'components/ToggleTab';

type ArrowParams = { children: React.ReactNode, identity: string, onClickHandler: React.MouseEventHandler };
// returns an JSX component that returns buttons on both sides to help increment and decrement child value.
export const ArrowsInput = ({ children, identity, onClickHandler }: ArrowParams) => {
    // placeholder button 
    return (
        <div className="flex flex-row" >
            <button id={`${identity}_subtract`} type="button" name="subtract" onClick={onClickHandler} className={`arrow-btn`}> - </button>
            <div id={`${identity}_value`} className="static-number">{children}</div>
            <button id={ `${identity}_addition` } type="button" name="add" onClick={onClickHandler} className={`arrow-btn`}> + </button>
        </div>
    )
}
type UniqueSelectorT = {
    identity: string,
    options?: Set<number | string>,
    onChangeHandler: React.ChangeEventHandler,
    value: string | number,
}

export const UniqueSelector = ({ identity, options , onChangeHandler, value }: UniqueSelectorT) => {

    const list = [];
    const option = options.forEach((e, index) => {
        const jsx = (<option key={`opt_${identity}_${index}`} value={e}>{e}</option>)
        list.push(jsx)
    });

    return (
        <div className='flex flex-row'>
            <select id={identity} onChange={onChangeHandler} value={value} style={{
                width: '55px', height: '35px', textAlign: 'center'}}>
                {list}
            </select>
        </div>
    )
}

type SwitchTabsT = {
    selected: string,
    pattern: {
        [key: string]: {
            id: string, value: string
        }
    },
    onClickHandler: React.MouseEventHandler
};
// Layout ONLY -> for switching input mode for a form ( or other similar content display ) 
export const SwitchTabs = ({selected,  pattern, onClickHandler } : SwitchTabsT) => {
    
    const list = Object.values(pattern).map((e, index) => {
        return (
            <button
                id={e.id}
                name={e.id}
                className={`btn-1 btn-xl ${selected === e.id ? 'btn-active' : ''}`}
                key={`btn-${index}`}
                onClick={onClickHandler}
                type="button"
            >
                {e.value}
            </button>
        )
    })
    return (<>{list}</>)
}


export const getMaxKeyByValue = (classes: { [key: string]: number }) => {
    let max = Number.MIN_SAFE_INTEGER; 
    let maxKey = '';
    Object.entries(classes).forEach(([key, value]) => {
        maxKey = value > max ? key : maxKey;
        max = value > max ? value : max;
    })
    return maxKey;
}



type ModelPattern = {
    [key: string]: {
        id: string, // used for html id, and looking up state 
        value: string, // the actual string that will be displayed to users on the button UI
        element?: React.ReactNode // JSX element that will be rendered on lookup.
    }
}

type StateManagerT = {
    classes: {
        [key: string]: number
    },
    state: ABStateT,
    setStats: React.Dispatch<AbilityScoreAction>
}

const StatInformation = ({ mainClass}: {mainClass: string}) => {
    return (
        <>
        <div style={{ margin: 'min(30px, 5%)' }} >
        <h2>Summary of Each Ability</h2>
            <section className='res-2-2' >
            {ability_score_model.map((e, i) => {
                return (
                    <div className='aside_note deep_blue_card_shadow'>
                        <div key={`stat_info_${i}`}>
                            <div className="flex flex-column">
                                <h3 ><strong style={{ color: 'black', fontSize: "1.25em" }}>{e.term} ({e.abbr})</strong></h3>
                                <p>{e.description} </p> 
                                <span style={{ marginLeft: "30px" }}><i>{e.example}</i></span>
                            </div>
                        </div>
                    </div>
                )
            })}
            </section>
        </div>
        
        <span>For your main class: <strong>{mainClass}</strong>, we recommend to prioritize following stats: </span>
            <ul style={{ listStyle: 'none', fontSize: '1.2em', fontWeight: 'bolder'}}>
                {class_data[mainClass] && class_data[mainClass].recommended_stats.map((e, index) => {
            return (
            <li key={`stat_rec_${e}`} style={{float: 'left', marginLeft: "30px"} }>
                {e.toUpperCase()}
            </li>
        )
        })} 
        </ul>    
        </>
    )
}
// parent component that soley handles state management system for point allocation system.
export const StateManger = ({ classes, state, setStats }: StateManagerT) => {
    const mainClass = getMaxKeyByValue(classes);
    const patterns = useABSModel(mainClass, state, setStats);
    const ability_section: React.MutableRefObject<HTMLDivElement> = useRef(null);
    
    useEffect(() => {
        ability_section.current.scrollIntoView();
    }, [ability_section])
    
    // switch the point allocation method and reset the stats
    const onClickHandler = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        setStats({ type: 'swap', pattern: target.name as PatternT, field: mainClass })
    }

    return (
        <FieldSet toggle={true} state='' path='' legend_title='Ability Score' description="Baseline character stats that helps determine how likely a character will succeed! at specific tasks!">
            <section ref={ability_section} id="ability_section" className="flex flex-column" style={{margin: '30px 0px'}}>
                <StatInformation mainClass={mainClass} />
            </section>
        <SwitchTabs pattern={patterns} selected={state.pattern} onClickHandler={onClickHandler} />    
            {patterns[state.pattern]?.element || "Comming soon!"}
        </FieldSet>
    )
}

// Model for each seperate allocation mode 
export const useABSModel = (mainClass : string, state: any, setStats: any ) : ModelPattern => {
    // retrieve the class that the user is most likely going to focus on (higest level)
    

    const patterns : ModelPattern= {
        standard: { id: 'standard', value: 'Standard Array', element: <StandardArray mainClass={mainClass} state={state} setStats={setStats} />},
        buy: { id: 'buy', value: 'Point Buy',  element: <PointBuy mainClass={mainClass}  state={state} setStats={setStats}  />  },
        roll: { id: 'roll', value: "Roll", element: <RollCharacterStatsPage state={state} setStats={setStats} /> }
    }
    return patterns;
}

type ScoreTableStructT = {
    children: React.ReactNode,
    disabledCost?: boolean // Disabled last column 
}
// resuable component for headers for ability scores. 
export const ScoreTableStructure = ({children, disabledCost=false}) : React.ReactNode => {
    // 8 rows => 1 header, 1 footer, and 6 ability scores.

    return (
        <StatsTable col_length={6} row_length={8}>
            <h2>Ability</h2>
            <h2>Score</h2>
            <h2>Bonus</h2>
            <h2>Modifier</h2>
            <h2>Total</h2>
            <h2>Cost</h2>
            {children}
        </StatsTable>
        )
}

            //      8, 9, 10, 11, 12, 13, 14, 15
const pointBuyMap = [0, 1, 2, 3, 4, 5, 7, 9];

const calculatePointsLeft = (stats: number[]) => {
    let points = 27 - stats.reduce((acc, curr) => { 
        return acc + (pointBuyMap[curr - 8] || 0);
    }, 0); 

    return points;
}


const CharacterScoreTable = ({ onChangeHandler, state }: { onChangeHandler: any, state: ABStateT}) => {    
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


const StandardArray = ({ mainClass, state, setStats }: { mainClass: string, state: ABStateT, setStats: React.Dispatch<AbilityScoreAction>
}) => {


    const avaliableOptions = ['--', 15, 14, 13, 12, 10, 8];
    
   
    const onChangeHandler = (index: number) => (e: React.ChangeEvent) => {
        const target = e.currentTarget as HTMLSelectElement;
        const selectValue = target.options[target.selectedIndex].value;
        const oldValue = state.standardOptions.trackOptionsByIndex[index];

        setStats({ type: 'update_array', index: index, newValue: selectValue, pattern: 'standard', oldValue: oldValue})
    }

    return (
        <CharacterScoreTable state={state} onChangeHandler={onChangeHandler} />
    )
}



const PointBuy = ({ mainClass, state, setStats }: { mainClass: string,     state: ABStateT,
    setStats: React.Dispatch<AbilityScoreAction>
}) => {
    const score = state.stats as number[];
    const pointsLeft = calculatePointsLeft(score as number[]); // calculated from state 

    const onClickerHandler = (i: number) => (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        const index = score[i] as  - 8;
        // stop if you dont have enough points.
        if (target.name === 'add') {
            if (pointsLeft <= 0) { 
                let a = document.getElementById(target.id + '_subtract');
                return;
            }
            else if (pointsLeft - pointBuyMap[index] < 0) { 
                return;
            }
        }
        setStats({type: target.name as AbilityScoreActions, amount: 1, index: i})
    }

    const displayNextCost = (e: number) => { 
        if (e === 8) return 0;
        if (e === 15) return "MAXED OUT: 9";
        return pointBuyMap[e - 8];
    }

    const list = ability_names_arr.map((e, i) => {
        const onClicker = onClickerHandler(i);
        const logic = displayNextCost(score[i])
        const modifer = Number.isInteger(state.stats[i]) ? Math.floor((state.stats[i] as number - 10 )/ 2) : '--'
        return (
            <>
                <label htmlFor={e + "_value"}>{e.toUpperCase()}</label>
                <ArrowsInput onClickHandler={onClicker} identity={e}>
                    {state.stats[i]}
                </ArrowsInput>
                <span>+0</span>
                <span>{modifer}</span>
                <span>{state.stats[i]}</span>
                <span>{logic}</span>
            </>
        )
    })
    return (
        <>
            <ScoreTableStructure>
                {list}
                <span style={{gridColumn: '5/6' }}>{ pointsLeft.toString()} Points Left</span>
            </ScoreTableStructure>
        </>
    )
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
// single source of truth for image dice path 
// placeholder images...
export const getDiceImageLocation = () => {
    const base_dir = 'public/';
    const path = 'img/dice/';
    // note: SOME dies types will have different images
    const d4 = ['d6_1.png', 'd6_2.png', 'd6_3.png', 'd6_4.png'];
    const d6 = [...d4, 'd6_5.png', 'd6_6.png'];
    return {
        d4, d6, path
    }
    // TODO : add more images for up to d10!
}
export type dieResults = { stats: number[], minIndex: number, total: number }

const RollCharacterStatsPage = ({setStats, state}) => {
    const { batchRoll } = useDiceRoller({ quantity: 4, quality: 6 });
    const { d6, path } = getDiceImageLocation();
    // Index of state.stat where this specific element is assigned to. 0 === not yet assigned.
    // const [options, setOption] = useState([0, 0, 0, 0, 0, 0]) 
    
    const ability_score = ['--', ...ability_names_arr];

    const onClickHandler = () => {
        var res = batchRoll(6);
        // this will reset the current state to the new randomized array
        setStats({type:'generate_and_save_options', options: res})
    }
 
    // TODO set the data-key value in order to find the corresponding stat!
    const onChange = (index: number, total: number) => (e: React.ChangeEvent) => {
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.options[target.selectedIndex].text; 
        setStats({ type: "update_without_swapping", pattern:'roll', newValue: total, index: index, ability_name: value });
    }

    const generateSelectOptions = (index: number, total: number, htmlId: string) => {
        const onChangeHandler = onChange(index, total);
        const opt = new Set<string | number>([...ability_score]);
        const options = state.randomABSOptions.optionsLeft;
        for (let i = 0; i < options.length; i++) {
            if (i !== index && options[i] > 0) {
                opt.delete(ability_score[options[i]]);
            }
        }
        return (
            <UniqueSelector identity={htmlId} onChangeHandler={onChangeHandler} value={ability_score[options[index]]} options={opt} /> 
        )
    }

    return (
        <>
            <br />
            <RollLayoutPage onClickHandler={onClickHandler} onChange={onChange} generateSelectOptions={generateSelectOptions} state={state} path={path} d6={d6} />
            </>
    )
}

const RollLayoutPage = ({onClickHandler, onChange, generateSelectOptions, state, path, d6}) => {
    return (
        <div className="flex flex-column">
            <h2>Roll for Random Stats!</h2>
            <span>
                Rules: For each stat, roll a 4d6 (6-sided dice 4 times) and drop the lowest value. The remaining 3 dice will determine the result for a single stat.
                Then select whichever stat you want to assign the total result to!
            </span>
            <button className="btn-1 btn-xl" type="button" style={{ maxWidth: '100px', margin: '40px'}} onClick={onClickHandler}>Roll 4d6</button>
            <div className="flex flex-row" style={{ minWidth: '80%', minHeight: "200px", flexWrap: 'wrap', border: '1px solid red', justifyContent: 'center'}}>
                {state.randomABSOptions.stats && state.randomABSOptions.stats.length === 6 &&
                    state.randomABSOptions.stats.map((row: dieResults, x: number) => {
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
                                                <img className={`${y === row.minIndex ? "disabled-opacity " : '' }` } id={id} src={path + d6[result-1]} width={30} alt={'1d6 dice icon with result of ' + result.toString()} />
                                                <label className={`${y === row.minIndex ? "disabled-opacity " : ''}`} htmlFor={id}>{result.toString()}</label>
                                                
                                            </div>
                                        })
                                    }
                                </div>
                                <div style={{minWidth: "200px"}}>
                                <label htmlFor={id} style={{fontSize: '0.7em'}}>Select an Ability</label>
                                {generateSelectOptions(x, total, id)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            </div>
    )
}

type RollParams = {
    quantity: number,
    quality: number,
    min?: number,
    max?: number,
    reroll: boolean, // for advantage or disadvantage
}
// decorator -> returns a set of functions 
const useDiceRoller = ({ quantity, quality, min = 1, max = 100, rerolls = false }) => {
    // sanitize input
    quantity = Math.floor(quantity);
    quality = Math.floor(quality);
    min = Math.floor(min);
    max = Math.floor(max);
    
    min = min > 0 ? min : 1;
    min = min < 100 ? min : 100; 
    max = max > 0 ? max : 1;
    max = max < 100 ? max : 100;  
    quality = quality < max ? quality : max; 
    quantity = quantity <= 100 ? quantity : 100; 

  
    const rollDice = () : dieResults => {
        var result = {stats: [], minIndex: 0, total: 0};
        var minValue = max;
        for (let i = 0; i < quantity; i++){
            var die = Math.floor(Math.random() * (quality - min + 1) + min)
            result.stats.push(die);
            if (die < minValue) {
                minValue = die;
                result.minIndex = i;
            }
            result.total += die;
        }
        return result;
    }

    const batchRoll = (amount: number) : dieResults[] => {
        amount = amount < 100 ? amount : 100; // limit number of rolls
        var result = [];
        for (let i = 0; i < amount; i++){
            result.push(rollDice());
        }
        return result;
    }

    return {rollDice, batchRoll};
}


//----------- high order clousure test
//const exampleTest = () => {
    // const [stats, setStats] = useState([0, 0, 0, 0, 0, 0]);
    // const onClickHandler = (index: number) => (e: React.MouseEvent) => {
    //     // safer to use currentTarget (avoids propagation?)
    //     const target = e.currentTarget as HTMLButtonElement;
    //     let change = 1;
    //     if (target.name === 'subtract') { change = -1; }
    //     setStats(prev => {
    //         return prev.map((e, i) => {
    //             return i != index ? e : e + change;
    //         })
    //     })
    // }    
    // const list = ability.map((e, index) => {
    //     const closureClicker = onClickHandler(index);
    //     return (
    //         <div key={index} className="flex" >
    //             <label htmlFor={e}>{e.toUpperCase()}</label>
    //             <ArrowsInput identity={e} onClickHandler={closureClicker}> 
    //                 {stats[index]}
    //             </ArrowsInput >
    //         </div>
    //     )
    // })
//}