import { useState } from 'react';
import { IdentityForm } from './CharacterSheet/IdentityForm';

import '../assets/css/form.css';

export function CampaginPage() {
    const [error, setError] = useState(false);
    const [tab, setTab] = useState(4);

    const doAction = (e) => { 
        e.preventDefault();
        setError(!error);
    }

    return (
        <IdentityForm/>
    )
}