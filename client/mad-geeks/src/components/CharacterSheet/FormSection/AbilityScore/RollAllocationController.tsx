// types
import { ABStateT } from "components/CharacterSheet/state/AbilityScoreDispatcher";
import { AbilityScoreAction, AbilityScoreActions } from "components/CharacterSheet/model";


// model
import { ability_names_arr } from "assets/dndModel";
import { generateRollDisplay } from "./RollAllocationModel";

// custom hooks
import { getDiceImageLocation } from "hooks/getDiceImageLocation";
import { useDiceRoller } from "hooks/useDiceRoller";

// reusable components
import { RollLayoutPage, CharacterScoreTable, ScoreTableStructure } from "./RollAllocationModel";
import { ArrowsInput, UniqueSelector } from "components/CustomInput";


// helper functions and variables  ===============================================================================================

// these functions and variables are separated for later testing purposes. Not reusable outside this scope = Refactor?
const pointBuyMap = [0, 1, 2, 3, 4, 5, 7, 9]

const calculatePointsLeft = (stats: number[]) => {
    let points = 27 - stats.reduce((acc, curr) => { 
        return acc + (pointBuyMap[curr - 8] || 0);
    }, 0); 

    return points;
}

const generateOption = (onChange: any, ability_score: string[], state: any) => {
    var closure =  (index: number, total: number, htmlId: string) => {
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
    return closure
}

const generatePointBuy = (onClickerHandler, displayNextCost, score, state) => {
    return ability_names_arr.map((e, i) => {
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
}




// Standard Array ===============================================================================================

export const StandardArray = ({ mainClass, state, setStats }: { mainClass: string, state: ABStateT, setStats: React.Dispatch<AbilityScoreAction>}) => {
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

// Point Buy ===============================================================================================

export const PointBuy = ({ state, setStats }: { mainClass: string, state: ABStateT, setStats: React.Dispatch<AbilityScoreAction>}) => {
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

    const list = generatePointBuy(onClickerHandler, displayNextCost, score, state);
    return (
        <>
            <ScoreTableStructure>
                {list}
                <span style={{gridColumn: '5/6' }}>{ pointsLeft.toString()} Points Left</span>
            </ScoreTableStructure>
        </>
    )
}

// Roll Random ===============================================================================================

export const RollCharacterStatsPage = ({setStats, state}) => {
    const { batchRoll } = useDiceRoller({ quantity: 4, quality: 6 });
    const { d6, path } = getDiceImageLocation();
    const ability_score = ['--', ...ability_names_arr];

    const onClickHandler = () => {
        var res = batchRoll(6);
        // this will reset the current state to the new randomized array
        setStats({type:'generate_and_save_options', options: res})
    }
 
    const onChange = (index: number, total: number) => (e: React.ChangeEvent) => {
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.options[target.selectedIndex].text; 
        setStats({ type: "update_without_swapping", pattern:'roll', newValue: total, index: index, ability_name: value });
    }

    const generateSelectOptions = generateOption(onChange, ability_score, state);
    const items = generateRollDisplay(generateSelectOptions, state, path, d6, onChange)

    return (
        <>
            <br />
            <RollLayoutPage onClickerHandler={onClickHandler}>
                <>{items}</>
            </RollLayoutPage>
        </>
    )
}


