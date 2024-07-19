import { useState, createContext } from 'react';
import { IdentityForm } from './CharacterSheet/IdentityForm';
import '../assets/css/form.css';


const MultiPageContext = createContext({});

export function CampaginPage() {
    const [error, setError] = useState(false);
    const [tab, setTab] = useState(0);
    const [fields, setFields] = useState({});

    const doAction = (e) => { 
        e.preventDefault();
        setError(!error);
    }

    return (
        <MultiPageContext.Provider value={{tab, setTab, fields, setFields}}>
            <IdentityForm />
        </MultiPageContext.Provider>
    )
}