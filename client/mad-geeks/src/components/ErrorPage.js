import { useRouteError } from "react-router-dom";
import "../assets/css/error.css";
export function ErrorPage() { 
    const err = useRouteError();
    console.log(err);

    return (
        <div className="error">
            <h1 className="errorHeading">Sorry! Something went wrong.</h1>
            
            <p>{err.status} - <em>{err.statusText || err.message}</em></p>
        </div>
    );
}
