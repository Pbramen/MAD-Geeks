import {useState} from "react";
import { useNavigate } from "react-router-dom";

function SignInForm() {
    const nav = useNavigate();
    const [error, setError] = useState(null);

    const validate = function (e) {
        e.preventDefault();
        //console.log(e.target.username.value);
        //console.log(e.target.password.value);
        //check for valid password, if true: 
        if (true) {
            nav('/home');
        }
        else { 
            setError("Value here");
        }
    }
    return (
        <section className="login-section">
            <h2 className="sign-in-title">Sign In</h2>
            <form className="sign-in-form" onSubmit={validate}>
                <label htmlFor="username" className="form-label"><em>username/email:</em></label>
                <input type="text" id="username" name="username" required></input>

                <label htmlFor="password" className="form-label" required><em>password:</em></label>
                <input type="password" id="password" name="password"></input>

                <button type="submit" className="login">
                    Login
                </button>
            </form>
            <p>OR</p>
            <a >Register for new account</a>
            {error && <p>{error}</p>}
        </section>
    )
}

export default SignInForm;