import { CharaSheetContext } from "components/context/CharacterForm.";
import React, { ReactNode, useState } from "react";
import { CharacterSheetType } from "./CharacterSheetType";
import {PaginationContext } from "components/Pagination/PaginationContext";

export function CharacterSheetProvidor({ children }: { children: ReactNode }) {
    const [payload, setPayload] = useState<CharacterSheetType | {}>({});
    const [current_page, setCurrent_Page] = useState<number>(0);
    return (
        <PaginationContext.Provider value={{current_page, setCurrent_Page}}>
            <CharaSheetContext.Provider value={{ payload, setPayload } } >
                {children}
                </CharaSheetContext.Provider>  
        </PaginationContext.Provider>
    )
}