import { createContext } from 'react';
import { CharacterSheetType, responseType } from './CharacterSheetType';

interface CharacterContextType {
    payload: CharacterSheetType | null,
    setPayload: React.Dispatch<CharacterSheetType> | null;
}

export const SheetContext = createContext<CharacterContextType | null>({payload: null, setPayload: null});
