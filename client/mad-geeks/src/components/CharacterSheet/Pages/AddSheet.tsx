import React, {useContext, useEffect, } from 'react';
// context/states
import { usePageParam } from './usePageParam';
import { PaginationBar } from 'components/Pagination/PaginationBar';
// navigation 

// pages
import { BiographyPage } from './BiographyPage';
import { ClassAndLevelPage } from './ClassAndLevelPage';

/*
    Parent component that handles page switching and displaying the correct form
*/
export const AddSheet = ({ }) => {
    
    // navigation 
    const {
        current_page,
        setCurrent_Page,
        max_page,
        pageParam,
        setPageParam
    } = usePageParam();
   
    
    const list = ["Biography", "Classes", "Skills", "Inventory", "Spells", "Other"]
    var output = null;

    // used for pagination 
    const onPageSwitch = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        if (!target.disabled) {
            setCurrent_Page(parseInt(target.getAttribute('data-key')));
        }
    }

    const pageNum = Number(pageParam.get("page")) | 0
    switch (pageNum) {
        case 0:
            output = <BiographyPage disabled={false} />
            break;
        case 1:
            output = <ClassAndLevelPage disabled={false} />
        case 2: 
        case 3: 
        case 4:
        case 5:
        default: 
            
    }
    return (
        <div className='flex flex-column stretch centered'>
            <PaginationBar list={list} eventHandler={onPageSwitch} />
            <section className={'chara-form flex flex-column '}>
                <section className="main-body">
                    {output}
                </section>
            </section>
        </div>

        )   
}