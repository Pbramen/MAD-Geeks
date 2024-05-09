import {useState} from "react";
import { useNavigate } from "react-router-dom";

function SignInForm() {
    const nav = useNavigate();
    const [error, setError] = useState(null);

    const validate = async function (e) {
        e.preventDefault();
        //console.log(e.target.username.value);
        //console.log(e.target.password.value);
        const headers = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                "Origin": "http://localhost:3000",
            },
            body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
        };
   
        fetch("/api/clients/validateAuth", headers)
            .then(async (response) => {
                const json = await response.json();
                return json;
            })
            .then((json) => {
                // need some other message....
                if (json.status === 'ok') {
                    nav('/home');
                }
                else {
                    setError('Some error here....');
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
                <h2 className="sign-in-title">Sign In</h2>
                <form className="sign-in-form" onSubmit={validate} method="GET">
                    <label htmlFor="username" className="form-label"><em>username/email:</em></label>
                    <input type="text" id="username" name="username" required></input>

                    <label htmlFor="password" className="form-label" required><em>password:</em></label>
                    <input type="password" id="password" name="password"></input>

                    <button type="submit" className="login">
                        Login
                    </button>
                </form>
        
                <a>Register for new account</a>
            </div>
            {error && <p>{error}</p>}
        </section>
    )
}

export default SignInForm;