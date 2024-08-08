import { createContext, Dispatch, SetStateAction } from 'react';
import { demographic } from 'components/CharacterSheet/CharacterSheetType';
export type errorList = {
    [key: string]: string // message
}

export interface ErrorState  {
    demographic_err?: demographic,
    classAndStats_err?: errorList,
    skills_err?: errorList,
    inventory_err?: errorList,
    spells_err?: errorList,
    other_err?: errorList, 


    setDemographic_err?: Dispatch<SetStateAction<demographic>>,
    setClassAndStats_err?: Dispatch<SetStateAction<errorList>>,
    setSkills_err?: Dispatch<SetStateAction<errorList>>,
    setInventory_err?: Dispatch<SetStateAction<errorList>>,
    setSpells_err?: Dispatch<SetStateAction<errorList>>,
    setOther_err?: Dispatch<SetStateAction<errorList>>, 
}


export const FormErrorContext = createContext<ErrorState>({});
