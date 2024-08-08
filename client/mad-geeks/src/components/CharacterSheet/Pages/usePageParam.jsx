import { useSearchParams } from 'react-router-dom'; 
import { useEffect } from 'react';
import { usePagination } from 'components/Pagination/usePagination';


export const usePageParam = () => {
    // pagination state is used to set restrictions on navigation!
    const { current_page, setCurrent_Page, max_page} = usePagination();
    const [ pageParam, setPageParam] = useSearchParams({ page: current_page });

    useEffect(() => {
        const newParam = Number(pageParam.get("page")) | 0
        if (newParam > max_page) {
            setPageParam({page: '0'});
        }
        setCurrent_Page(newParam);
    }, [pageParam]) 

    return {
        current_page,
        setCurrent_Page,
        max_page,
        pageParam,
        setPageParam
    }
}