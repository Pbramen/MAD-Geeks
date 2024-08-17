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
// ==================           END             ==========================


/**
 * 
 * @param children: {JSX} - React children (the form itself)
 * @param page - {(string | number)[number]} - List or number of items to be displayed as navigation links
 * @param pageTracker: {usePageParam} - See usePageParam 
 * 
 * NOTES: 
 *  1. Pass in a two states: state (tracks which field has errors), and errors (tracks number of fields with errors) 
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


//==============================================================================
export const CreateCharacter = () => {
    const pages = ['Biography', "Classes", "Skills", "Inventory", "Spells"]  // title of the current page
    const { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page } = usePageParam();
    const [sheetError, setSheetErrors] = useSheetErrorLocations();      // used for currently displayed page and final validation process.
    const [countErrors, setCountErrors] = useState([0, 0, 0, 0, 0])     // used to display alerts for each individual page.
    const timeout = useRef(null);

    const {
        control,
        handleSubmit,
        watch
    } = useForm({
        mode: 'onSubmit'
    });
    // search param for page as integer
    const pageNumber = parseInt(pageParam.get('page'));

   
    // parameters to set reusable Pagination
    const MultiPageParams = {
        page: pages,
        pageTracker: { max_page, pageParam, setCurrent_Page, setPageParam, setMax_page, current_page },
        errors: countErrors,
        state: sheetError
    }
   

    const submitForm = (data: FormData) => {
        console.log(data);
    }
    const watcher = watch('character-name');


    return (
        <div className="flex flex-row" style={{ flexWrap: "wrap", justifyContent:"space-between", width: "100%" }} >
            
            <MultiPageLayout {...MultiPageParams}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="flex flex-column">
                        <Controller
                            name="character-name"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <label htmlFor="character-name"> Character name: </label>
                                    <input
                                        name="character-name"
                                        id="character-name"
                                        {...field}
                                    />
                                </>      
                            )}
                        />
                        <button className="btn-1">Submit</button>
                    </div>
                    <hr style={{
                        outline: "1px solid black",
                        border: "1px solid black",
                        marginTop: "35px",
                        marginBottom: "35px"
                    }} />

                    
                </form>
                </MultiPageLayout>
        </div>
    )  
}