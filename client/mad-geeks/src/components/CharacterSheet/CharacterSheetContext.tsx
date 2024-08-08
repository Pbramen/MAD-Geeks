import React, { createContext, Dispatch, SetStateAction } from 'react';
import { 
    demographic,
    class_type,
    combat,
    inventory,
    spells
  } from './CharacterSheetType';

export interface CharacterContextType {
    demographic: demographic,
    classes: class_type,
    skills: combat,
    inventory: inventory,
    spells: spells[],
    
    setDemographic: Dispatch<SetStateAction<demographic>>,
    setClasses: Dispatch<SetStateAction<class_type>>,
    setSkills: Dispatch<SetStateAction<combat>>,
    setInventory: Dispatch<SetStateAction<inventory>>,
    setSpells: Dispatch<SetStateAction<spells[]>>, 
}

export const SheetContext = createContext<CharacterContextType | null >( null );
