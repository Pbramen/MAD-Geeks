import { SheetContext } from "./CharacterSheetContext"
import React, { SetStateAction, useContext } from "react"

export const useCharacter = () => {
    const {
        demographic,
        setDemographic,
        classes,
        setClasses,
        skills,
        setSkills,
        inventory,
        setInventory,
        spells,
        setSpells
    } =  useContext(SheetContext);
    
    
    return {
        demographic,
        setDemographic,
        classes,
        setClasses,
        skills,
        setSkills,
        inventory,
        setInventory,
        spells,
        setSpells
    }
}