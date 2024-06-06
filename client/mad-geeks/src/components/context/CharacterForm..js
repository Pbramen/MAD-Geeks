import { createContext, useState } from 'react';

export const CharaSheetContext = createContext({})

export function CharacterForm({ children }) {
    const page_headers = {
        0: 'Basic Information',
        1: 'Ability Score',
        2: 'Skills and Proficiencies',
        3: 'Starting Equipment',
        4: 'Spells',
        5: 'Background',
        6: 'Other'

    }

    const [page, setPage] = useState(0);

    const [fields, setField] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        classes: {},
        species: "",
        level: "",
        background: "",
        ability_score: {
            STR: 10,
            CON: 10,
            DEX: 10,
            WIS: 10,
            INT: 10,
            CHAR: 10
        },
        equipment: {},
        traits: "",
        ideals: "",
        bonds: "", 
        flaws: "",
        skills: {}, 
        otherProf: {},
        age: 0,
        height: "",
        weight: "",
        eyes: "",
        skin: "",
        hair: "",
        appearance: "",
        allies: "",
        fraction: "",
        background: "",
        otherFeatures: "",
        spells: {}
    })

    return (
        <CharaSheetContext.Provider value={{page, setPage, page_headers, fields, setField}}>
            {children}
        </CharaSheetContext.Provider>
    )
}