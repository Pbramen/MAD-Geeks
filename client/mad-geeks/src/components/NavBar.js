import '../assets/css/nav.css';
import { useState } from 'react';

export function NavBar() { 
    const [isOpen, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen((open) => !open);
    };

    return (
        <nav className="nav">
            <div className="flex-column">
            <div className={`nav-trigger`} onClick={toggleMenu}>Trigger </div>
            <ul className={`nav-list ${isOpen ? 'is-open' : ""}`} >
                <li><a>Home</a></li>
                <li><a>Campagins</a></li>
                <li><a>Characters</a></li>
                <li><a>Account</a></li>
                </ul>
            </div>
        </nav>
    )
}