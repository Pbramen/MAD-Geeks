
import { useForm } from 'react-hook-form';
import React, { useEffect, useState, useRef, useCallback, SetStateAction} from 'react';

// custom hooks
import { useAbilityReducer } from './state/useAbilityReducer';
import { usePageParam } from "./Pages/usePageParam";
import { useSheetErrorLocations } from './hooks/useSheetErrors';
import { useShowAbilitySummary } from './hooks/useShowAbilitySummary';
import { useLoadProficiencyChoices } from './hooks/useLoadProficiencyChoices';

// model
import { biography_fields } from "components/biographyPaths";

// reusable components
import { ClassCard } from "./ClassCard";
import { MultiPageLayout } from 'components/MultiPageLayout';
import { BiographyPage } from './FormSection/BiographyPage';
import { StateManger } from "./FormSection/AbilityScore/AbilityScoreManager";
import { ErrorMessage } from 'components/SmallErrorMessage';
import { StatInformation } from './SummaryAbilityScore';

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
    const { isSummaryVisable, showSummary } = useShowAbilitySummary();
    const { classProficencies, selectedSkills, setSelectedSkills } = useLoadProficiencyChoices(setConnectionError, setLoading);
    const pageNumber = useRef(0);
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

    useEffect(() => {
        const a = parseInt(pageParam.get('page'));
        if (Number.isNaN(a)) {
            console.log("uhoh");
            pageNumber.current = 0;
        }
        else 
            pageNumber.current = parseInt(pageParam.get('page'))
    }, [pageParam])
    

    // TODO: is react-hook-forms necessary?
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
        if (pageNumber.current === 2) {
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
            const path = biography_fields?.[pageNumber.current]?.[e]
            // set the error 
            if (path !== undefined) {
                detectedErrors.add(e);
                countErrTemp += 1;
            }
        })

        
        // create a deep copy of the CURRENT page of errors AND overrite with new detected errors 
        // this will also remove corrected errors!
        var newObj = { ...sheetError, [biography_fields?.[pageNumber.current]?.id]: detectedErrors };
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
                if (pageNumber.current == index)
                    return countErrTemp;
                return e;
            })
        })
    }
    useEffect(() => {
        // small hack for firefox users causing unexpected scroll behavior...
        const a = document.getElementById('stat-page')
        if (a)
            a.style.display = 'none';
        window.scrollTo(0, 0);
    }, [pageParam])

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
        {
            element: <BiographyPage
                control={control}
                errors={errors.current}
                sheetError={sheetError} />,
        },
        {
            element: <ClassCard
                control={control}
                errors={errors.current}
                sheetError={sheetError}
                classState={classes}
                dispatch={setClasses} />
        },
        {
            element: <StateManger
                classes={classes}
                state={stats}
                setStats={dispatcher}
                onHelperClick={showSummary}
                classProficencies={classProficencies}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
                onNoSetClassClick={(e: React.MouseEvent) => {
                    setPageParam({ page: '1' })
                }}
            />,
            pop_up: <StatInformation onClick={showSummary} />
        }
    ]
    const valid = pageNumber.current < pageElements.length;
    return (
        <>
            {valid && pageElements[pageNumber.current]?.pop_up && isSummaryVisable && pageElements[pageNumber.current].pop_up}
            <div className="flex flex-row form-wrapper" >
                {connectionError && <ErrorMessage message={connectionError} onClick={(e) => setConnectionError("")} />}
                <MultiPageLayout {...MultiPageParams}>
                
                    <form onSubmit={handleSubmit(handleFormSubmission)} onChange={handleChanges}>
                        { loading ? <div>Loading...</div> : 
                            <>
                                {valid && pageElements[pageNumber.current].element}
                                <div className="float-right">
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

