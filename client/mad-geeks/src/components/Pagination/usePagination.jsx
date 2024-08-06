import { PaginationContext } from "components/Pagination/PaginationContext";
import { useContext, useEffect } from "react";

export const usePagination = () => {
    return useContext(PaginationContext);
}