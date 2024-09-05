import { useEffect } from "react";
import { PaginationBar } from "components/Pagination/PaginationBar"

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
export const MultiPageLayout = ({ state, children, page, pageTracker, errors}) => {
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
                <section className='chara-form flex flex-column '>
                    <section className="main-body">
                        {children}
                    </section>
                </section>
            </div>
        {/*TODO: remove when modularizing*/}    
        </> 
    )
}

