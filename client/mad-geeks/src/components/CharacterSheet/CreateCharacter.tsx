import { PaginationBar } from "components/Pagination/PaginationBar"
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import React, { useEffect, useState, useRef, useCallback} from 'react';
import { usePageParam } from "./Pages/usePageParam";
import { biography_fields } from "components/biographyPaths";
import { TErrorSheetMapping } from "./ErrorProvider";
import { useSheetErrorLocations, getErrorDefaults } from "./ErrorProvider";
import { DevTool } from "@hookform/devtools";

// ================== REMOVE AFTER MODULARIZING ============================
import set from 'lodash.set'
import get from 'lodash.get'
// ==================           END             ============================
// ==============================================================
import { createContext, useContext } from 'react';
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
const DynamicController = ({  errors, html, validation, name, control, path, options, label, divStyle, ...rest }:DynamicControllerType ) => {
    const errorID = 'err_' + name;
    const [previewImg, setPreviewImg] = useState("");


    const handleImageUpload = (e: any) => {
        const files = e.target?.files?.[0]
        const filePath = URL.createObjectURL(files);
        console.log("handling impage upload...")
        setPreviewImg(filePath.toString());
    }


    const input = (field: any, fieldError = null) => {
        // if fieldError is defined, then alert the user!
        switch (html) {
            case 'select':
                return (
                    <select name={name} aria-errormessage={errorID} aria-invalid={fieldError ? true : false} id={name} {...field} {...rest}>
                        {options &&
                            options.map((option) => {
                            
                                return (<option key={option} value={option}>{option}</option>)
                            })
                        }
                    </select>
                );
            
            case 'textarea':
                return (
                    <textarea name={name} aria-invalid={fieldError ? true : false } aria-errormessage={errorID} id={name} {...field} {...rest}/>
                )
            case 'input':
                // CAN ONLY BE USED IN PARENT COMPONENT! (if used in child, need to revokeURL EACH time a page is switched!)
                if (rest.type === 'img') {
                    return (
                        <>
                            <input style={{color: 'black'}} name={name} value='' aria-invalid={fieldError ? true : false} aria-errormessage={errorID} id={name} onChange={handleImageUpload}  {...rest} />
                            {previewImg && <img src={previewImg} /> }
                        </>
                    )
                }
            default:
                return (
                    <input name={name} aria-invalid={fieldError ? true : false} aria-errormessage={errorID} id={name} {...field} {...rest}/>
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
                    <div className="flex flex-column" style={divStyle}>
                        <label htmlFor={name}>{label}</label>
                        {input({value, onChange, onBlur }, fieldState.error)}
                        {
                            fieldState.error && 
                            <span className="alert-text" aria-live='polite'>{fieldState.error.message}</span>
                        }
                    </div>
                )
            }}
        />
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
                            label="*First Name:"
                            name="first_name"
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
                        <DynamicController
                            label="Middle Name:"
                            name="middle_name"
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            
                        />
                        <DynamicController
                            label="Last Name:"
                            name="last_name"
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            maxLength={32}
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

export const ClassesPage = ({ control, errors, sheetError}) => {

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
                    
                    control={control}
                    path={path + 'fighter'}
                    html="input"
                    label="*Class and Levels:"
                />
                <DynamicController
                    errors={errors}
                    name="str"
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
    const pages = ['Biography', "Classes", "Skills", "Inventory", "Spells"]  // title of the current page
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = usePageParam();
    const [signal, setSignal] = useState(0);                            // signal state to help track when potential errors or corrections to form occurs
    const [sheetError, setSheetErrors] = useSheetErrorLocations();      // used for currently displayed page and final validation process.
    const [countErrors, setCountErrors] = useState([0, 0, 0, 0, 0])     // used to display alerts for each individual page.
    const timeout = useRef(null);
    const [previewImg, setPreviewImg] = useState('');

    const {
        formState: { errors },
        control,
        handleSubmit,
        trigger,
    } = useForm({
        mode: "onBlur",
        reValidateMode: 'onBlur',
        shouldFocusError: true,
    })
    
    // search param for page as integer
    const pageNumber = parseInt(pageParam.get('page'));

    // TODO: final validation  
    const handleFormSubmission = ((data: React.FormEvent) => {
        // contains all the data from the form itself (does not contain the html element)
        console.log('hottogo!')
        // handle submit will only run when there are no errors detected
        if (Object.keys(errors).length > 0) return false;
    })

    const validate = () => {
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
    const imageHandler = (e: any) => {
        const target = e.target;
        const file = URL.createObjectURL(target.files[0]);
        setPreviewImg(file);
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
                        <ClassesPage control={control} errors={errors.current} sheetError={sheetError}/>
                    )
                }
                
                <button className="btn-1"  type="button" onClick={onClicker}>Continue</button>
                <button type="button" className="btn-1"  >Create</button>
                
              
            </form>
            </MultiPageLayout>
        </div>
    )  
}