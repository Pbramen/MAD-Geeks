import { PaginationBar } from "components/Pagination/PaginationBar"
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import React, { useEffect, useState, useRef, useCallback} from 'react';
import { usePageParam } from "./Pages/usePageParam";
import { biography_fields } from "components/biographyPaths";
import { TErrorSheetMapping } from "./ErrorProvider";
import { useSheetErrorLocations, getErrorDefaults } from "./ErrorProvider";
import { ClassCard } from "./ClassCard";
import { dieResults, StateManger } from "./AtomicComponents";
import { class_data } from "assets/dndClassByLevel";
import { DynamicController } from "./DynamicController";
import { ability_names_arr } from "assets/dndClassByLevel";
// ================== REMOVE AFTER MODULARIZING ============================
import set from 'lodash.set'
import get from 'lodash.get'
// ==================           END             ============================
// ==============================================================
import { createContext, useContext, useReducer } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { FieldSet } from "components/FieldSet";
import { DragAndDropImage } from "components/DragAndDropImage";


// ==============================================================

/**
 * 
 * @param children: {JSX} - React children (the form itself)
 * @param page - {(string | number)[number]} - List or number of items to be displayed as navigation links
 * @param pageTracker: {usePageParam} - See usePageParam 
 * 
 * NOTES: 
 *  1. Watch debounce function as it may have strange behavior when switching pages on sucess. (should just revalidate 
 *     already submitted form, but may break if continue button shifts to an unknown page number.)
 *  2. Pass in a two states: state (tracks which field has errors), and errors (tracks number of fields with errors) 
 *      2a. TODO: Combine the two states
 */
const MultiPageLayout = ({ state, children, page, pageTracker, errors}) => {
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = pageTracker
    const n = page.length;
    
  
    const validatePageParam = (newPage : string) => {
        const intPage = parseInt(newPage);
        // move back to the front of the form if invalid 
        if (!Number.isNaN(intPage) && intPage > 0 && intPage < n && intPage <= max_page) { 
            return true;
        }
        return false;
    }
    // on page load or shift, set current page!
    useEffect(() => {
        const newPage = pageParam.get("page");
        if (!validatePageParam(newPage)) {
            setPageParam({ page: '0' });
            setCurrent_Page(0);
        } 
        else {
            const intPage = parseInt(newPage);
            setCurrent_Page(prev => intPage);
            if (intPage > max_page) setMax_page(intPage);
        }
    }, [pageParam])

    // handles page jumping when clicking on the banner!    
    const onPageSwitch = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLButtonElement;
        if (!target.disabled) {
            const newPage = target.getAttribute('data-key');
            validatePageParam(newPage) ? setPageParam({ page: newPage }) : setPageParam({ 'page': '0' });
        }
    }
    return (
        <> {/*TODO: remove when modularizing*/}
            <div className='flex flex-column stretch centered' style={{justifyContent: 'flex-start'}}>
                <PaginationBar stateError={state}  list={page} eventHandler={onPageSwitch} current_page={current_page} max_page={max_page} errors={ errors } />
                <section className={'chara-form flex flex-column '}>
                    <section className="main-body">
                        {children}
                    </section>
                </section>
            </div>
        {/*TODO: remove when modularizing*/}    
        </> 
    )
}
//==============================================================================
export const BiographyPage = ({ control, errors, sheetError }) => {
    const path = 'biography'

    const common = {
        state: sheetError,
        path: path,
        toggle: true
    }
    
    const demoSetting = {
        legend_title: "Demographic",
        description: "Forge your character's current physical state, and set their name, age, species, etc.",
        ...common
    }
    const backSettings = {
        legend_title: "Background",
        description: "Dig into the archives and define your characters previous journeys and relations",
        ...common
    }

    const appearanceSettings = {
        legend_title: "Appearance",
        description: "Depict the visage of your character, either by words, or image!",
        ...common
    }

    const personalitySettings = {
        legend_title: "Personality",
        description: "Detail your character's traits: quirks, weaknesses, strengths, and more.",
        ...common
    }
    
    return (
        <>
            <FieldSet key='demogrpahic' {...demoSetting}>
                <div className="flex flex-column form-body">
                    <div className="flex flex-row re-form">
                        <DynamicController
                            label="*Character Name:"
                            name="charcter_name"
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Please fill out this field!'
                                },
                                maxLength: {
                                    value: 32,
                                    message: 'Limit to 32 characters max!'
                                }
                            }}
                            path={path + '.demographic'}
                            html="input"
                            maxLength={32}
                            errors={errors}
                            control={control}
                            
                        />
                    </div>
                    <div id="test" className="flex flex-row re-form" >
                        <DynamicController
                            label="Gender:"
                            name="gender"
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            maxLength={32}
                        />
                        <DynamicController
                            label="Age:"
                            name="age"
                            validation={{
                                pattern: {
                                    value: '/^[0-9]*$/',
                                    message: "Age must be in number format only!"
                                }
                            }}
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            type='number'
                            className="width-m"
                        />

                        <DynamicController
                            label="Species:"
                            path={path + '.demographic'}
                            html="select"
                            options={[
                                'Dragonborn', 'Dwarf', "Hafling", "Human", "Elf", "Half-elf", "Orc", "Half-Orc", 'Tiefling', "Other"
                            ]}
                            name="species"
                            errors={errors}
                            control={control}
                            className="width-m"
                        />
                    </div>
                </div>
            </FieldSet>
            {/* Background information */}
            <FieldSet {...backSettings} >
                <div className='flex flex-column form-textarea form-body'>
                <span className="optional-tag"><em>Optional</em></span>
                <DynamicController
                    name="backstory"
                    label="Backstory:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="Enter your tragic backstory here"
                />
                <DynamicController
                    name="allies"
                    label="Allies:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all friends and allies"
                />
                <DynamicController
                    name="enemies"
                    label="Enemies:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all your enemies"
                    />
                <DynamicController
                    name="fractions"
                    label="Fractions:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all organizations/fractions your character is apart of"
                />
                    </div>
            </FieldSet>
            <FieldSet {...appearanceSettings} >
                <DynamicController
                    name="height"
                    label="Height:"
                    path={path + '.appearance'}
                    html="input"
                    errors={errors}
                    control={control}
                    type="text"
                />
                <DynamicController
                    name="eye"
                    label="Eye color:"
                    path={path + '.appearance'}
                    html="input"
                    errors={errors}
                    control={control}
                    type="text"
                />
                
            </FieldSet>
            <FieldSet {...personalitySettings} >
                    hello
            </FieldSet>
        </>
    )
}

type AbilityScoreT = number[] | string[]
export type PatternT = "buy" | "standard" | "roll";
export type AbilityScoreActions = 'add' | 'subtract';
type IncrementP = { type: AbilityScoreActions, index: number, amount: number };
type ResetP = { type: 'reset' | 'swap', pattern: PatternT, field?: string };
type RecommendP = { type: 'recommend', pattern?: 'buy', class: string, field: string };
type UpdateP = { type: 'update_array' | 'update_without_swapping', pattern: 'standard' | 'roll', newValue: number, index: number, ability_name?: string}
type GenerateOptionsP = { type: 'generate_and_save', options: dieResults[] }
export type AbilityScoreAction = IncrementP | ResetP | RecommendP | UpdateP | GenerateOptionsP
    
export type ABStateT = {
    stats: AbilityScoreT,
    pattern: PatternT,
    randomABSOptions: {
        results: dieResults[] | null,
        optionsLeft : number[]
    }
}


const minInt = (min: number) => (value: number) => {
    console.log(value, min);
    return min <= value;
}

const maxInt = (max: number) => (value: number) => {
    return max >= value;
}


const abilityScoreReducer = (state:  ABStateT, action: AbilityScoreAction) : ABStateT => {
    console.log("hello there!")

    const ability_score = ['--', ...ability_names_arr];
    const dispatcher = {
        buy: {
            base: [8, 8, 8, 8, 8, 8]
        },
        // [str, con, dex, wis, int, char]
        standard:  {
            bard: [8, 12, 14, 13, 10, 15],
            barbarian: [15, 14, 13, 8, 10, 12],
            fighter: [15, 14, 13, 10, 12, 8],
            wizard: [8, 14, 10, 12, 15, 13],
            sorcerer: [8, 14, 10, 12, 13, 15],
            warlock: [8, 14, 10, 12, 13, 15],
            rogue: [8, 12, 15, 13, 10, 14],
            ranger: [10, 14, 15, 12, 13, 8],
            base: ['--'] // fallback
        }, 
        roll: {
            base: ['--', '--', '--', '--', '--', '--']
        }
    }
    type LUT =  {
        [key: string]: {
            validate: ((...value: any[]) => boolean),
            update: ((...value: any[]) => ABStateT | void) 
        }
    }
    // prevent state from changing 
    const validateMin = minInt(8);
    const validateMax = maxInt(15);

    console.log(state, action.type);
    let p = state.pattern;
    const LUT_actions = {
        'add': {
            update: (() => {
                const a = action as IncrementP;
                const score = state.stats as number[];
                if (!validateMax(a.amount + score[a.index])) return state;
                return {
                    ...state, stats: (score.map((e, i) => { return i === a.index ? a.amount + score[a.index] : e }))
                }
            })
        },
        'subtract': {
            update: (() => {
                const a = action as IncrementP;
                const score = state.stats as number[];
                if (!validateMin(score[a.index] - a.amount)) return state;
                return {
                    ...state, stats: (score.map((e, i) => { return i === a.index ? score[a.index] - a.amount : e }))
                }
            })
        },
        // manual reset button
        'reset': { 
            update: () => {
                const a = action as ResetP;
                if (p === 'standard') {
                    return { ...state, stats: dispatcher[p][a.field || 'barbarian'], pattern: p }
                }
                return { ...state, stats: dispatcher[p]['base'], pattern: p }
            }
        },
        // on page switch 
        'swap': {
            update: () => {
                const a = action as ResetP;
                p = a.pattern;
                
                console.log("swapping to ", p);
                if (p === 'standard') {
                    return { ...state, stats: dispatcher[p][a.field || 'barbarian'], pattern: p }
                }
                return { randomABSOptions: { stats: [], optionsLeft: dispatcher.roll.base}, stats: dispatcher[p]['base'], pattern: p }
            }
        },
        'recommend': {
            update: () => {
                const a = action as RecommendP
                return { ...state, stats: dispatcher[p][a.field], pattern: p }
            }
        },
        'update_array': {
            update: () => {
                const a = action as UpdateP;
                const score = state.stats as number[] | string[]
                
                const oldValue = score[a.index];
                const res = score.map((e: string | number, i: number) => {
                    // check if index is not the selected index && updated value is found
                    if (i !== a.index && e === a.newValue) {
                        return oldValue;
                    }
                    if (i === a.index) {
                        return a.newValue;
                    }
                    return e;
                })
    
                return { ...state, stats: res }
            }
        },
        'generate_and_save_options': {
            update: () => {
                const a = action as GenerateOptionsP;
                // reset the options to empty / not yet picked
                return { ...state, randomABSOptions: {...state.randomABSOptions, stats: a.options, optionsLeft: [0, 0, 0, 0, 0, 0]} }
            }
        },
        'update_without_swapping': {
            update: () => {
                const a = action as UpdateP;
                const score = state.stats as number[] | string[]
                const ab_index = ability_score.indexOf(a.ability_name) - 1;

                console.log(a.ability_name, 'found at ', ability_score.indexOf(a.ability_name), ' in', ability_score);
                // given the new index, change the stats
                return {
                    ...state, stats: score.map((e: number | string, i: number) => {
                        if (ab_index !== -1 && ab_index === i) {
                            return a.newValue as number;
                        }
                        return e; 
                    }
                    ), 
                    randomABSOptions: {
                        ...state.randomABSOptions, optionsLeft: state.randomABSOptions.optionsLeft.map((e, i) => {
                            // set which options have been picked. if 0, no stat was allocated yet.
                            if (i === a.index)
                                return ability_score.indexOf(a.ability_name);
                            // return i === ability_score.indexOf(a.ability_name) - 1 ?  : e;
                            return e;
                    })}
                }
            }
        }
    }

    const actionState = LUT_actions[action.type];
    if (actionState) {
        return actionState?.update();
    }
    return state;
}

//==============================================================================
export const CreateCharacter = () => {
    const pages = ['Biography', "Classes", "Skills", "Inventory", "Spells"]  // title of the current page
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = usePageParam();
    const [sheetError, setSheetErrors] = useSheetErrorLocations();      // used for currently displayed page and final validation process.
    const [countErrors, setCountErrors] = useState([0, 0, 0, 0, 0])     // used to display alerts for each individual page.
    const timeout = useRef(null);
    const [previewImg, setPreviewImg] = useState('');
    const [stats, dispatcher] = useReducer(abilityScoreReducer, {
        stats: [8, 8, 8, 8, 8, 8],
        pattern: "standard",
        randomABSOptions: {
            results:
                [{ stats: [], minIndex: 0, total: 0 }],
            optionsLeft: [0, 0, 0, 0, 0, 0] 
        }
    })
    type ClassType = {
        [key: string]: number // classname and level    
    }
    // source of truth
    // form fields
    const [classes, setClasses] = useState<ClassType>({
        'barbarian': 0,
        'bard': 0,
        'fighter': 0
    });
    const [abilityScore, setAbilityScore] = useState<number[]>([8, 8, 8, 8, 8, 8]);
    const [allocationOption, setAllocationOption] = useState<string>('standard');
    const {
        formState: { errors },
        control,
        handleSubmit,
        trigger,
    } = useForm({
        mode: "onChange",
        reValidateMode: 'onChange',
        shouldFocusError: true,
    });
    
    // search param for page as integer
    const pageNumber = parseInt(pageParam.get('page'));

    // TODO: final validation  
    const handleFormSubmission = ((data: React.FormEvent) => {
        const isValid = trigger();
        if (!isValid) {
            console.log("Please Review your form!")
            return;
        }
        // contains all the data from the form itself (does not contain the html element)
        console.log('hottogo!')
        console.log(data);
        // handle submit will only run when there are no errors detected
        if (Object.keys(errors).length > 0) return false;
    })

    const validateStates = () => { 
        if (pageNumber === 2) {
            console.log("placeholder attempting to check for valid stat allocation...")
            return false;
        }
        return false; 
    }

    const validate = () => {
        const page = validateStates();
        
        var detectedErrors = new Set<string>([]);
        var countErrTemp = 0;
        // Determine all errors relevent to this page
        Object.keys(errors).forEach(e => {
            const path = biography_fields?.[pageNumber]?.[e]
            // set the error 
            if (path !== undefined) {
                detectedErrors.add(e);
                countErrTemp += 1;
            }
        })
        if (!page) {
            detectedErrors.add('skills')
        }
        
        // create a deep copy of the CURRENT page of errors AND overrite with new detected errors 
        // this will also remove corrected errors!
        var newObj = { ...sheetError, [biography_fields?.[pageNumber]?.id]: detectedErrors };
        // TODO: implement a way to manage form fields to focus AND scroll to first error
        if (detectedErrors) {
            const arr = Array.from(detectedErrors);
            const firstTarget = document.getElementById(arr[0]);
            firstTarget?.focus();
        }
        console.log(newObj);
        // batch update -> set up errors so that we an update external ui components!
        setSheetErrors(newObj);
        setCountErrors((prev) => {
            return prev.map((e, index) => {
                if (pageNumber == index)
                    return countErrTemp;
                return e;
            })
        })
    
    }
   

    // handle error changes
    useEffect(() => {
        validate();
    }, [errors])

    // debounce the onChange to prevent over rendering/ uncessary state changes!
    // force useEffect when errorrs obtains a mutable change
    const handleChanges: React.FormEventHandler = () => {
        if (timeout.current !== undefined)
            clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            
            validate();
        }, 300)
    }

    // trigger validation for the current page ONLY. If success, move to next page. Else trigger useEffect
    // to handle side effects for error alerting and error states.
    const onClicker: React.FormEventHandler = async (e: React.FormEvent) => {
        const isValid = await trigger();
        if (!isValid) {
            validate();
            e.preventDefault();
            return;
        }
        else {
            const next = parseInt(pageParam.get('page')) + 1;
            if (max_page < next) {
                setMax_page(next);
            }
            setPageParam({ "page": next.toString() })
        }
    }

    // parameters to set reusable Pagination
    const MultiPageParams = {
        page: pages,
        pageTracker: { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page },
        errors: countErrors,
        state: sheetError
    }

    return (
        <div className="flex flex-row" style={{ flexWrap: "wrap", justifyContent:"space-between", width: "100%" }} >
            
        <MultiPageLayout {...MultiPageParams}>
            <form onSubmit={handleSubmit(handleFormSubmission)} onChange={handleChanges}>
                {
                    pageNumber === 0 && (
                        <BiographyPage control={control} errors={errors.current} sheetError={sheetError}/>
                    )
                }
                {
                    pageNumber === 1 && (
                        <ClassCard control={control} errors={errors.current} sheetError={sheetError} classState={classes} dispatch={setClasses} />     
                    )
                    }
                    {
                        pageNumber === 2 && (
                            <StateManger classes={classes} state={stats} setStats={dispatcher} />
                        )
                    } 
       
                <div className="nav-btn">
                    <button className="btn-1" style={{fontSize:"1.2em"}}  type="button" onClick={onClicker}>Continue</button>
                    <button type="submit" className="btn-1" style={{fontSize:"1.2em"}}>Create</button>
                </div>
            </form>
            </MultiPageLayout>
        </div>
    )  
}