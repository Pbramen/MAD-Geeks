import '../assets/css/nav.css';
import { Link } from 'react-router-dom';

export function NavBarComp({ baseUrl='/', links, parent_style='nav main-nav', child_style='nav-list' }) { 
    if (!links) {
        return (<></>)
    }
    const tabs = links.map((e, index) => {
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