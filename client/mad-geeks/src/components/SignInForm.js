import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { setJWTCookie, decodeJWT } from "../assets/js/cookieHandler";

function SignInForm() {
    const nav = useNavigate();
    const [error, setError] = useState(null);
    
    const validate = async function (e) {
        e.preventDefault();
        const headers = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                "Origin": "http://localhost:3000",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
        };
   
        fetch("http://localhost:4000/api/clients/validateAuth", headers)
            .then(async (response) => {
                const json = await response.json();
                return json;
            })
            .then((json) => {
                // need some other message....
                if (json.status && json.status === 'SUCCESS' && json.msg && json.msg === "AUTH_OK" ) {
                    nav(json.link );
                }
                else {
                    setError(json.msg);
                }
            })
            .catch((err) => { 
                //TODO: log error here
                console.log(err);
            })
    }


    return (
        <section className="form-card">
            <div className="border"></div>
            <div className="card-banner">MadGeeks</div>
            <div className="form-group">
                {error && <div className='alert'>*Invalid username or password.</div>}
                <h2 className="sign-in-title">Sign In</h2>
                <form className="sign-in-form" onSubmit={validate} method="GET">
                    <label htmlFor="username" className="form-label"><em>username/email:</em></label>
                    <input type="text" id="username" name="username" className={error ? "invalid-field": ""} required></input>

                    <label htmlFor="password" className="form-label" required><em>password:</em></label>
                    <input type="password" id="password" name="password" className={error ? "invalid-field": ""}></input>

                    <button type="submit" className="login">
                        Login
                    </button>
                </form>
        
                <a>Register for new account</a>
            </div>
        </section>
    )
}

export default SignInForm;