import React, {useContext, useEffect, createContext} from 'react';
import { useAxiosP } from 'hooks/useAxiosP';
import { usePagination } from 'components/Pagination/usePagination';
import { Form } from 'components/prefabs/FormComponents';
import { CharaSheetContext } from 'components/context/CharacterForm.';
import { CharacterSheetType } from './CharacterSheetType';
import { PaginationBar } from 'components/Pagination/PaginationBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { CharacterSheetProvidor } from './CharacterSheetProvidor';    
import { PaginationContext } from 'components/Pagination/PaginationContext';
export const AddSheet = ({ }) => {    
    const axios = useAxiosP();
    const { current_page, setCurrent_Page } = useContext(PaginationContext);
    const { payload } = useContext(CharaSheetContext) as CharacterSheetType;
    const { pathname } = useLocation();
    const nav = useNavigate();
    useEffect(() => { 
        nav(`${pathname}?page=${current_page}`);
    }, [current_page, nav, pathname]);
    const list = ["Biography", "Classes", "Stats & Skills", "Inventory", "Spells", "Other"]

    const isSubClassPageOpen = () => {
        // check if level is set 
        if (payload.classes.cleric?.level >= 2 || payload.level >= 3) {
            return true;
        }
    }
    
    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {       
        e.preventDefault();
        const target = e.target as HTMLButtonElement;

        const new_page = parseInt(target.getAttribute("data-key"), 10);
        if (Number.isNaN(new_page)) {
            console.log(target.value);
        }
        setCurrent_Page(()=>new_page);
        console.log(new_page, current_page);
        
    }

    
    switch (current_page) {
        case 0:
            // identity (name, age, background story, dob, etc)
            break;
        case 1:
            // class selection/ level selection.
            break;
        case 2:
            // roll or pick your distrubuted stats
            // pick your proficiencies/skills!
            break;
        case 3:
            // Pick your starting inventory    
            break;
        case 4: // (optional, but all classes can view anyways)
            // spell selection 
            break;
        case 5:
            // other relevant information
            break;
        default:
            //throw an error here           
    }    

    return (
        <section className={'campagin-form flex flex-column '}>
            <PaginationBar list={list} eventHandler={onButtonClick} />
            <Form style={""} >
                {"stuff"}
            </Form>
        </section>
        )   
}