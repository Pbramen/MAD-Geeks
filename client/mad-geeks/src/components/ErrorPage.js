import "../assets/css/error.css";
import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
    const err = useRouteError();
    
    return (
        <div className="error">
            <h1 className="errorHeading">Sorry! Something went wrong.</h1>
            {err && <p>{ err.statusText || err.message }</p>}
          
        </div>
    );
}
