import { PaginationContext } from "components/Pagination/PaginationContext";
import { Outlet } from "react-router-dom";
import { useState } from 'react';

// temporarily setting state to 2. note the max page should be set to 0 at prod.
export const PageSheetProvider = ({}) => {
    const [current_page, setCurrent_Page] = useState<number>(0);
    const [max_page, setMax_page] = useState<number>(2);
    return (
        <PaginationContext.Provider value={{current_page, setCurrent_Page, max_page, setMax_page}}>
            <Outlet />
        </PaginationContext.Provider>
    )
}