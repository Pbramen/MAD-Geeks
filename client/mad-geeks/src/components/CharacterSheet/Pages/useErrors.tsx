import { FormErrorContext } from "components/context/CharacterFormErrorsContext";
import { useContext } from 'react';

export const useErrors = () => {
    const {
        demographic_err,
        classAndStats_err,
        skills_err,
        inventory_err,
        spells_err,
        other_err,
        setDemographic_err,
        setClassAndStats_err,
        setSkills_err,
        setInventory_err,
        setSpells_err,
        setOther_err
    } = useContext(FormErrorContext);
    
    return {
        demographic_err,
        classAndStats_err,
        skills_err,
        inventory_err,
        spells_err,
        other_err,
        setDemographic_err,
        setClassAndStats_err,
        setSkills_err,
        setInventory_err,
        setSpells_err,
        setOther_err
    }
}