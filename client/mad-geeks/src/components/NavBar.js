import '../assets/css/nav.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
                <li><Link to={`/`}>Home</Link></li>
                <li><Link to="/campagins">Campagins</Link></li>
                <li><Link to="/characters">Characters</Link></li>
                <li><Link to="/login">Account</Link></li>
                </ul>
            </div>
        </nav>
    )
}