import { PaginationContext } from "components/Pagination/PaginationContext";
import { useContext } from "react";

export const usePagination = () => {
    return useContext(PaginationContext);
}