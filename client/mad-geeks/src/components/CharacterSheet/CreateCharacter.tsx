import { PaginationBar } from "components/Pagination/PaginationBar"
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import React, { useEffect, useState, useRef} from 'react';
import { DevTool } from '@hookform/devtools'
import { usePageParam } from "./Pages/usePageParam";
import { biography_fields } from "components/biographyPaths";
import { TErrorSheetMapping } from "./ErrorProvider";
import { useSheetErrorLocations, getErrorDefaults } from "./ErrorProvider";
// ================== REMOVE AFTER MODULARIZING ============================
import set from 'lodash.set'
import get from 'lodash.get'
// ==================           END             ============================
// ==============================================================
import { createContext, useContext } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { FieldSet } from "components/FieldSet";


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
    
    // useEffect(() => {
    //     console.log("MultiPageLayout errors: ", errors);
    // }, [errors])
    // validates for changes against the parameter (use on page load or when attempting to nav)
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

//==============================================================================
// import {Controller} from 'react-hook-forms';

type DynamicControllerType = {
    html: 'input' | 'select' | 'textarea',
    validation?: any,
    name: string,
    control: any,
    path: string,
    label: string,
    options?: string[],
    [key: string]: any // remainder 
}

// ...rest === field from Controller render!
// path = path.to.error.mapping used for ui notification on failure.
const DynamicController = ({ errors, html, validation, name, control, path, options, label, ...rest }:DynamicControllerType ) => {
    const errorID = 'err_' + name;
    const [sheetError, setSheetErrors] = useSheetErrorLocations(); 
    
    const input = (field: any) => {
        switch (html) {
            case 'select':
                return (
                    <select name={name} aria-errormessage={errorID} id={name} {...field} {...rest}>
                        {options &&
                            options.map((option) => {
                            
                                return (<option key={option} value={option}>{option}</option>)
                            })
                        }
                    </select>
                );
            
            case 'textarea':
                return (
                    <textarea name={name} aria-errormessage={errorID} id={name} {...field} {...rest}/>
                )
            default:
                return (
                    <input name={name} aria-errormessage={errorID} id={name} {...field} {...rest}/>
                )
        }
    }

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={''}
            rules={{...validation} }
            render={({ field: {value, onChange, onBlur}, fieldState }) => {
                return (
                    <div>
                        <label htmlFor={name}>{label}</label>
                        {input({value, onChange, onBlur})}
                        {
                            fieldState.error && 
                            <span aria-live='polite'>{fieldState.error.message}</span>
                        }
                    </div>
                )
            }}
        />
    )
}

//==============================================================================
export const BiographyPage = ({ control, errors }) => {
    const [sheetError, _] = useSheetErrorLocations();
    const path = 'biography'

    // useEffect(() => {
    //     console.log("sheet Error has updated as expected", sheetError)
    // }, [sheetError])


    const FieldSetting = {
        legend_title: "Biography",
        description: "Set your character's demographic information here ~ ",
        state: sheetError,
        path: path,
        toggle: true
    }
    const commonFields = {
        errors: errors,
        control: control,
    }
    return (
        <>
            <FieldSet key='demogrpahic' {...FieldSetting}>
                <DynamicController
                    label="*Character Name:"
                    name="name"
                    validation={{ required: { value: true, message: 'Please fill out this field!' } }}
                    path={path + '.demographic'}
                    html="input"
                    {...commonFields}
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
                    {...commonFields}
                />
                <DynamicController
                    label="Gender:"
                    name="gender"
                    validation={{
                        maxLength: {
                            value: "32",
                            message: "Limit to 32 characters"
                        }}
                    }   

                    path={path + '.demographic'}
                    html="input"
                    {...commonFields}
                />
                <DynamicController
                    label="Species:"
                    path={path + '.demographic'}
                    html="select"
                    options={[
                        'Dragonborn', 'Dwarf', "Hafling", "Human", "Elf", "Half-elf", "Orc", "Half-Orc", 'Tiefling', "Other"
                    ]}
                    name="species"
                    {...commonFields}
                />
                
            </FieldSet>
        </>
    )
}


export const ClassesPage = ({ control, errors }) => {
    const [sheetError] = useSheetErrorLocations();

    const path = 'classes.'
    const FieldSetting = {
        legend_title: "Classes",
        description: "Set your character's demographic information here ~ ",
        state: sheetError,
        toggle: true,
        path: path
    }
    return (
        <>
            <FieldSet {...FieldSetting}>
                <DynamicController
                    errors={errors}
                    name="fighter"
                    validation={{ required: { value: true, message: 'Please fill out this field!' } }}
                    control={control}
                    path={path + 'fighter'}
                    html="input"
                    label="*Class and Levels:"
                />
                <DynamicController
                    errors={errors}
                    name="str"
                    validation={{ required: { value: true, message: 'Please fill out the age field!' } }}
                    control={control}
                    path={path + 'str'}
                    html="input"
                    label="str:"
                />
            </FieldSet>
        </>
    )
}

//==============================================================================
export const CreateCharacter = () => {
    const pages = ['Biography', "Classes", "Skills", "Inventory", "Spells"]
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = usePageParam();
    const [signal, setSignal] = useState(0);
    const [sheetError, setSheetErrors] = useSheetErrorLocations(); // used for currently displayed page and final validation process.
    const [countErrors, setCountErrors] = useState([0, 0, 0, 0, 0]) // used to display alerts for each individual page.

    const {
        formState: { errors },
        control,
        handleSubmit,
        trigger,
    } = useForm({
            mode: "onChange",
            shouldFocusError: true
        })


    // search param for page as integer
    const pageNumber = parseInt(pageParam.get('page'));

    // validates 
    const handleFormSubmission = ((data: React.FormEvent) => {
        // contains all the data from the form itself (does not contain the html element)
        console.log('hottogo!')
        // handle submit will only run when there are no errors detected
        if (Object.keys(errors).length > 0) return false; // fallback
    })

    // handle error changes
    useEffect(() => {
        // console.log("evaluating error...!")
        setTimeout(() => {
            var newObj: TErrorSheetMapping = { ...sheetError };
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
            if (detectedErrors === undefined || newObj[biography_fields?.[pageNumber]?.id]  === undefined) {
                console.error("Unxepcted error: ")
                console.error(detectedErrors);
                console.error(pageNumber, biography_fields?.[pageNumber])
                return false;
            }
            // overwrite the deep copy and then update state with new error
            newObj[biography_fields?.[pageNumber]?.id] = detectedErrors;
            setCountErrors((prev) => {
                return prev.map((e, index) => {
                    if (pageNumber == index)
                        return countErrTemp;
                    return e;
                })
            })
            setSheetErrors(() => { return { ...newObj } });

            // console.log(newObj);
       }, 500); //debounce for error updates

    }, [errors, signal])

    // force useEffect when errorrs obtains a mutable change
    const handleChanges = () => {
        setSignal((prev) => prev + 1 === 1000 ? 0 : prev + 1);
    }

    // trigger validation for the current page ONLY. If success, move to next page. Else trigger useEffect
    // to handle side effects for error alerting and error states.
    const onClicker = async (e) => {
        const isValid = await trigger();    
        if (!isValid) {
            // console.log("signal sent...")
            setSignal((prev) => prev + 1 === 1000 ? 0 : prev + 1);
            e.preventDefault();
            return;
        }
        else {
            const next = parseInt(pageParam.get('page')) + 1;
            setPageParam({"page": next.toString()})
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
        <MultiPageLayout {...MultiPageParams}>
            <form onSubmit={handleSubmit(handleFormSubmission)} onChange={handleChanges}>
                {
                    pageNumber === 0 && (
                        <BiographyPage control={control} errors={errors.current} />
                    )
                }
                {
                    pageNumber === 1 && (
                        <ClassesPage control={control} errors={errors.current} />
                    )
                }
                
                <button className="btn-1" onClick={onClicker} type="submit" >Continue</button>
                <button type="button" className="btn-1"  >Create</button>
            </form>
            <DevTool control={control} />
        </MultiPageLayout>
    )  
}