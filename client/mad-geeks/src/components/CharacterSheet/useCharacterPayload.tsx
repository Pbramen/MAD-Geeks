import { SheetContext } from "./CharacterSheetContext"
import React, { SetStateAction, useContext } from "react"
import { CharacterSheetType } from "./CharacterSheetType";

export const useCharacter = () => {
    const { payload, setPayload } =  useContext(SheetContext);
    if (payload !== null && setPayload !== null)
        return { payload, setPayload };
    
}