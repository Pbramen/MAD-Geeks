import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, Button } from "./prefabs/FormComponents"

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

            <div className="card-banner">MadGeeks</div>
            <div className="form-group">
                {error && <div className='alert'>*Invalid username or password.</div>}
                <h2 className="sign-in-title">Sign In</h2>
                <Form style={'sign-in-form'} handler={validate} autocomplete={"off"} >
                    <TextInput name={'username'} label_style={"form-label"} required={true} />
                    <TextInput name={'password'} label_style={"form-label"} required={true} type={"password"}/>
                    <Button value={"login"} style={ "login"}  />
                </Form>

                <a>Register for new account</a>
            </div>
        </section>
    )
}

export default SignInForm;