import { ability_score_model } from 'assets/dndClassByLevel';
import { createContext, useContext, useState, Dispatch, SetStateAction} from 'react';
import { Outlet } from 'react-router-dom';
// maps the location of each error to the toggle tab and defines how many errors have occured.
// used for responsive alerts when form submission fails.
// each field is unique
export interface TErrorSheetMapping{
    biography: {
        demographic: Set<string | null>,
        appearance: Set<string | null>,
        personality: Set<string | null>,
        background: Set<string | null>
    },
    classes: {
        classes: Set<string | null>,
    },
    skills: {
        ability_score: Set<string | null>,
        skills: Set<string | null>,
        savingThrows: Set<string | null>, 
    },
    inventory: {
        equipment: Set<string | null>,
        currency: Set<string | null>
    },
    spells: Set<string | null>,
    other: Set<string | null>
}

type SheetErrorState = [
    sheetErrors: TErrorSheetMapping,
    setSheetErrors: Dispatch<SetStateAction<TErrorSheetMapping>>
]
export const ErrorSheetMapping = createContext(null);

// --------------------
// import {Outlet} from 'react-dom-router'
export const getErrorDefaults = () : TErrorSheetMapping=>{
    return {
    biography: {
        demographic: new Set([]),
        appearance: new Set([]),
        personality: new Set([]),
        background: new Set([])
    },
    classes: {
        classes: new Set([]),
    },
    skills: {
        ability_score: new Set([]),    
        skills: new Set([]),
        savingThrows: new Set([]), 
    },
    inventory: {
        equipment: new Set([]),
        currency: new Set([])
    },
    spells: new Set([]),
    other: new Set([])
}}
export const ErrorSheetProvider = ({}) => {
    const [sheetErrors, setSheetErrors] = useState<TErrorSheetMapping>(getErrorDefaults());
    if (sheetErrors === null || setSheetErrors === null) {
        throw new Error("Unable to initalize sheetError's state from default settings. See console for more details.")
    }

    return (
        <ErrorSheetMapping.Provider value={[sheetErrors, setSheetErrors]}>
            <Outlet/>
        </ErrorSheetMapping.Provider>
    )
}

// ==============================================================

//==============================================================================
// import {TErrorSheetMapping, ErrorSheetMapping} from '??'
export const useSheetErrorLocations = () => {
    const [sheetErrors, setSheetErrors] = useContext(ErrorSheetMapping);
    if (sheetErrors === null || setSheetErrors === null) throw new Error("Unable to load context for sheet errors.");
    return [ sheetErrors, setSheetErrors]
}

//==============================================================================