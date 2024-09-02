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
import axios from "api/axios";
import { AxiosResponse } from "axios";

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
type UpdateP = { type: 'update_array' | 'update_without_swapping', pattern: 'standard' | 'roll', newValue: number | string, index: number, ability_name?: string, oldValue?: string}
type GenerateOptionsP = { type: 'generate_and_save', options: dieResults[] }
export type AbilityScoreAction = IncrementP | ResetP | RecommendP | UpdateP | GenerateOptionsP
    
export type ABStateT = {
    stats: AbilityScoreT,
    pattern: PatternT,
    randomABSOptions: {
        results: dieResults[] | null,
        optionsLeft: number[],
    },
    standardOptions: {
        trackOptions: { [key: string]: number },
        trackOptionsByIndex: string[]
    }
}


const minInt = (min: number) => (value: number) => {
    
    return min <= value;
}

const maxInt = (max: number) => (value: number) => {
    return max >= value;
}


const abilityScoreReducer = (state:  ABStateT, action: AbilityScoreAction) : ABStateT => {

    const ability_score = ['--', ...ability_names_arr];
    const dispatcher = {
        buy: {
            base: [8, 8, 8, 8, 8, 8],
            options: [8, 8, 8, 8, 8, 8]
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
            base: ['--', '--', '--', '--', '--', '--'], // fallback
            options: new Set([15, 14, 13, 12, 10, 8])
        }, 
        roll: {
            base: ['--', '--', '--', '--', '--', '--'], 
            options: ['--', '--', '--', '--', '--', '--']
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
        // on page switch or hitting the reset button 
        'swap': {
            update: () => {
                const a = action as ResetP;
                p = a.pattern;
                return {
                    ...state, standardOptions: {
                        trackOptions: { '--': -1, '15': -1, '14': -1, '13': -1, '12': -1, '10': -1, '8': -1 },
                        trackOptionsByIndex: ['--', '--', '--', '--', '--', '--']
                    },
                    randomABSOptions: {
                        stats: [],
                        optionsLeft: dispatcher[p].options
                    },
                    stats: dispatcher[p]['base'],
                    pattern: p
                }
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
                //const score = state.stats as number[] | string[]
                /*
                
                trackOptions.current = { ...trackOptions.current, [oldValue]: -1, [selectValue]: index }
                trackOptionsByIndex.current = trackOptionsByIndex.current.map((e, i) => {
                if (i === index) return selectValue;
                    return e;
                })
                
                */

                let newTrackOption = { ...state.standardOptions.trackOptions, [a.oldValue]: -1, [a.newValue]: a.index }
                let newTrackOptionByIndex = state.standardOptions.trackOptionsByIndex.map((e, i) => {
                    if (i === a.index) return a.newValue;
                    return e;
                })

                return {
                    ...state, 

                    stats: state.stats.map((e, i) => {
                        if (i === a.index) 
                            return a.newValue.toString();
                        return e;
                    }),
                    standardOptions: {
                        ...state.standardOptions,
                        trackOptions: newTrackOption,
                        trackOptionsByIndex: newTrackOptionByIndex
                    }
                }

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

                var random = {... state.randomABSOptions};
                // given the new index, change the stats
                if (a.pattern === 'roll') {
                    random = {
                        ...state.randomABSOptions, optionsLeft: state.randomABSOptions.optionsLeft.map((e, i) => {
                            // set which options have been picked. if 0, no stat was allocated yet.
                            if (i === a.index)
                                return ability_score.indexOf(a.ability_name);
                            // return i === ability_score.indexOf(a.ability_name) - 1 ?  : e;
                            return e;
                    })}
                }
                return {
                    ...state, stats: score.map((e: number | string, i: number) => {
                        if (ab_index !== -1 && ab_index === i) {
                            return a.newValue as number;
                        }
                        return e; 
                    }
                    ), 
                    randomABSOptions: random
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
    const [connectionError, setConnectionError] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [stats, dispatcher] = useReducer(abilityScoreReducer, {
        stats: ['--', '--', '--', '--', '--', '--'],
        pattern: "standard",
        randomABSOptions: {
            results:
                [{ stats: [], minIndex: 0, total: 0 }],
            optionsLeft: [0, 0, 0, 0, 0, 0],
        },
        standardOptions: {
            trackOptions: {'--': -1, '15': -1, '14': -1, '13': -1, '12': -1, '10': -1, '8': -1},
            trackOptionsByIndex:  ['--', '--', '--', '--', '--', '--']
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
    const [classProficencies, setClassProficencies] = useState(null);
    // load in the background!

    
    interface PayloadSchema {
        status: string,
        msg: string,
        payload: {
            choices: number,
            result: {
            ability_score: {
                index: string,
                name: string,
                url: string
            },
            desc: string[],
            index: string,
            name: string,
                url: string
        }
        }
    }

    const getProficiencies = (name: string) : Promise<AxiosResponse<PayloadSchema>> =>  {
        return axios.get('api/SRD/levelResource/' + name, { signal: AbortSignal.timeout(5000) })
    }

    useEffect(() => {
        if (classProficencies === null) {
            var data = {}
            
            Promise.all([getProficiencies('bard'), getProficiencies('barbarian'), getProficiencies('fighter')])
                .then((result ) => {
                    
                    for (let i = 0; i < result.length; i++){
                        let obj = result[i] as AxiosResponse<PayloadSchema>
                        if (obj.status === 200) {
                            console.log(obj.data.payload);
                        }
                    }
                setClassProficencies(data);
                }).catch(() => {
                
                setConnectionError("Server timeout!");
                console.log("timeout error set...")
            })
            }
    }, [])
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

        
        // create a deep copy of the CURRENT page of errors AND overrite with new detected errors 
        // this will also remove corrected errors!
        var newObj = { ...sheetError, [biography_fields?.[pageNumber]?.id]: detectedErrors };
        // TODO: implement a way to manage form fields to focus AND scroll to first error
        if (detectedErrors) {
            const arr = Array.from(detectedErrors);
            const firstTarget = document.getElementById(arr[0]);
            firstTarget?.focus();
        }
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
    <>
        
        <div className="flex flex-row" style={{ flexWrap: "wrap", justifyContent:"space-between", width: "100%", margin: "0 min(200px, 15%"}} >
        {connectionError && <ErrorMessage message={connectionError} />}
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
        </>
    )  
}

const ErrorMessage = ({ message } : {message: string}) => { 
    const [toggleOff, setToggleOff] = useState<boolean>(false);
    if (!toggleOff)
    {
        return (
            <div className="flex flex-row" style={{ alignItems: 'center', textAlign: 'center', background: "red", borderRadius: '50px', fontWeight: 'bold', padding: '5px', marginLeft: '35px' }}>
                <span aria-live="polite" style={{ fontSize: '0.8em', cursor: 'arrow'}}>{message}</span>
                <button type='button' style={{ cursor: "pointer", borderRadius: '50%', backgroundColor: 'black', color: "white", aspectRatio: '1/1', border: 'none', outline: 'none' }} onClick={(e)=>{e.preventDefault(); setToggleOff(true)}}>X</button>
            </div>
        )
    }
    return <></>
}