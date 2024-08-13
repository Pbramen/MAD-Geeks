import { usePagination } from "./usePagination"
import React ,{ useRef, useEffect} from 'react';

type PaginationParams = {
    max?: number,
    list?: string[],
    eventHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
    current_page?: number,
    max_page?: number,
    errors: any,
    stateError: any
}

export const PaginationBar = ({ stateError, max = 0, list, eventHandler, current_page, max_page, errors }: PaginationParams) => {
    var isList = false;
    if (max == 0 && list) isList = true
    else if (max == 0 && !list) throw new Error("Invalid parameters sent to Pagination Bar");
    

    // generate tabs based on number, else by string. This will determine each tab's location in searchParams.
    var items = !isList ? Array.from({ length: max }, (_, index) => index) : list;
    return (
            <nav className="pagination-wrapper">
                <ul className="pagination">
                    {
                        items.map((e: number | string, index: number) => {
                            var el = !isList ? index + 1 : e;
                            return (
                                <li className="pagination-item" key={index}>
                                        <button disabled={(max_page < index ) ? true : false} data-key={index} className={`pagination-btn ${index === current_page ? "current-btn" : ""} ${index + 1 === current_page ? "prev-btn" : ""} ${index > max_page ? "disabled" : ""}`} onClick={eventHandler} value={el}>
                                            {errors[index] > 0 && <span className="alert-notify">{errors[index]}</span>}
                                            <span data-key={index} className="btn=title">{el}</span>
                                        
                                        </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        )

}

