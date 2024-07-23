import { usePagination } from "./usePagination"
import React from 'react';

export const PaginationBar = ({ max=0, list, eventHandler }: {max?: number, list?: string[], eventHandler: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {
    var isList = false;
    const { current_page } = usePagination();
    if (max == 0 && list) isList = true
    else if (max == 0 && !list) throw new Error("Invalid parameters sent to Pagination Bar");

    var items = !isList ? Array.from({ length: max }, (_, index) => index) : list;
    console.log("inside bar: ", current_page);
        return (
            <ul className="pagination">
                {
                    items.map((e: number | string, index: number) => {
                        var el = !isList ? index + 1 : e;
                        return (
                            <li className="pagination-item" key={index}>
                                <button data-key={index} className={`pagination-btn ${index === current_page ? "current-btn" : ""} ${index + 1 === current_page ? "prev-btn" : ""}`} onClick={eventHandler} value={el}>
                                    <span data-key={index} className="btn=title">{el}</span></button>
                            </li>)
                    })
                }
            </ul>
        )

}

