import { SheetContext } from "./CharacterSheetContext";
import React, { ReactNode, useState } from "react";
import { CharacterSheetType, factoryCharacterSheet } from "./CharacterSheetType";
import {PaginationContext } from "components/Pagination/PaginationContext";
import { Outlet } from "react-router-dom";

export function CharacterSheetProvidor({ }) {
    const [payload, setPayload] = useState<CharacterSheetType | null>(factoryCharacterSheet());
    const [current_page, setCurrent_Page] = useState<number>(0);

    return (
        <PaginationContext.Provider value={{current_page, setCurrent_Page}}>
            <SheetContext.Provider value={{ payload, setPayload } } >
                 <Outlet />
            </SheetContext.Provider>  
        </PaginationContext.Provider>
    )
}