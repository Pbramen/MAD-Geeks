import { useContext } from 'react';
import { ErrorSheetMapping } from '../ErrorProvider'

export const useSheetErrorLocations = () => {
    const [sheetErrors, setSheetErrors] = useContext(ErrorSheetMapping);
    if (sheetErrors === null || setSheetErrors === null) throw new Error("Unable to load context for sheet errors.");
    return [ sheetErrors, setSheetErrors]
}
