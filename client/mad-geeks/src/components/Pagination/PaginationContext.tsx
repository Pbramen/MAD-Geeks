import { createContext, Dispatch, SetStateAction } from "react";

export interface Pagination {
    current_page: number | null,
    setCurrent_Page: Dispatch<SetStateAction<number>> 
}

export const PaginationContext = createContext<Pagination | null>({ current_page: 0, setCurrent_Page: () => {} });
