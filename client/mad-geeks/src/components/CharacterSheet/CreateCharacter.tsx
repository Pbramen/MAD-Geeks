
import { useForm } from 'react-hook-form';
import React, { useEffect, useState, useRef, useCallback} from 'react';

// custom hooks
import { useAbilityReducer } from './hooks/useAbilityReducer';
import { usePageParam } from "./Pages/usePageParam";
import { useSheetErrorLocations } from './hooks/useSheetErrors';

// model
import { biography_fields } from "components/biographyPaths";

// For RESTful api calls 
import axios from "api/axios";
import { AxiosResponse } from "axios";

// reusable components
import { ClassCard } from "./ClassCard";
import { MultiPageLayout } from 'components/MultiPageLayout';
import { BiographyPage } from './FormSection/BiographyPage';
import { StateManger } from "./FormSection/AbilityScore/AbilityScoreManager";
import { ErrorMessage } from 'components/SmallErrorMessage';

import { ability_score_model, class_data } from 'assets/dndModel';
const StatInformation = () => {
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
                                <h3 ><strong className='bold-dark-header'>{e.term} ({e.abbr})</strong></h3>
                                <p>{e.description} </p> 
                                <span className="example-text"><i>{e.example}</i></span>
                            </div>
                        </div>
                    </div>
                )
            })}
            </section>
        </div>
        
        </>
    )
}


//==============================================================================
export const CreateCharacter = () => {
    const pages = ['Biography', "Classes", "Skills", "Inventory", "Spells"]  // title of the current page
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = usePageParam();
    const [sheetError, setSheetErrors] = useSheetErrorLocations();          // used for currently displayed page and final validation process.
    const [countErrors, setCountErrors] = useState([0, 0, 0, 0, 0])         // used to display alerts for each individual page.
    const timeout = useRef(null);       
    const [loading, setLoading] = useState<boolean>(true)
    const [connectionError, setConnectionError] = useState(null);           // display connection to third-party API error
    const { stats, dispatcher } = useAbilityReducer();

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
        // When user first loads up the form, immediately attempt to grab data needed to render form elements
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
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(() => false);
                    }, 200)
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
    const pageElements = [
        { element: <BiographyPage control={control} errors={errors.current} sheetError={sheetError} />,},
        { element: <ClassCard control={control} errors={errors.current} sheetError={sheetError} classState={classes} dispatch={setClasses} />} ,
        { element: <StateManger classes={classes} state={stats} setStats={dispatcher} />, aside: <StatInformation/> }
    ]
    return (
        <>
            
            <div className="flex flex-row form-wrapper" >
                {connectionError && <ErrorMessage message={connectionError} onClick={(e) => setConnectionError("")} />}
                <MultiPageLayout {...MultiPageParams}>
                {pageElements[pageNumber]?.aside && pageElements[pageNumber].aside}
                    <form onSubmit={handleSubmit(handleFormSubmission)} onChange={handleChanges}>
                        { loading ? <div>Loading...</div> : 
                        <>
                            {pageElements[pageNumber].element}
                            <div className="nav-btn">
                                <button className="btn-1" style={{fontSize:"1.2em"}}  type="button" onClick={onClicker}>Continue</button>
                                <button type="submit" className="btn-1" style={{fontSize:"1.2em"}}>Create</button>
                            </div>
                        </>
                    }
                </form>
            </MultiPageLayout> 
            </div>
            
        </>
    )
    
}

