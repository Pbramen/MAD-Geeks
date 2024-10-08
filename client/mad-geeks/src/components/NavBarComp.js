import '../assets/css/nav.css'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function NavBarComp({ links, baseUrl='/', parent_style='nav main-nav', child_style='nav-list' }) { 
    useEffect(() => {
        console.log('nav bar reloaded.')
    }, [])
    
    const tabs = links.map((e, index) => {
        if (!e.path) {
            return (
                <li key={index}>
                    <Link>{e.value}</Link>
                </li>
            )
        }
        const link = baseUrl + e.path;
        return (
            <li key={index}>
                <Link to={link}>{e.name}</Link>
            </li>
        )
    })
    return (
        <nav className={parent_style}>
            <div className="flex-column">
                <ul className={child_style} >
                    {tabs}
                </ul>
            </div>
        </nav>
    )
}