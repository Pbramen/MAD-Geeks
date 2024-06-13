import {Link} from 'react-router-dom'
export function ConfirmationCard({ children, title, link=null }) {
    return (
        <section className="form-card confirm-card">
            <h2 className="card-banner">
                {title}
            </h2> 
            <p> {children} </p>
            {link &&
                <Link to={link} className="btn-1 active-btn">
                Login</Link>}
        </section>
    )
}