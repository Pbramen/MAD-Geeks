import React, { createContext, Dispatch, SetStateAction } from 'react';
import { factoryCharacterSheet, CharacterSheetType,  } from './CharacterSheetType';

interface CharacterContextType {
    payload: CharacterSheetType | null,
    setPayload: React.Dispatch<SetStateAction<CharacterSheetType>>
}

export const SheetContext = createContext<CharacterContextType | null >( null );
