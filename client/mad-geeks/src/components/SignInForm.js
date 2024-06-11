import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, Button } from "./prefabs/FormComponents"
import { CardOne } from "./CardOne";
import { formHeaderOptions } from "../assets/js/fetch";


function SignInForm() {
    const nav = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const validate = async function (e) {
        e.preventDefault();
        const headers = formHeaderOptions(JSON.stringify({ username: e.target.username.value, password: e.target.password.value }));
        setError("");
        setLoading(()=> true);
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
                setError("Something went wrong!");
                //TODO: log error here
                console.log(err);
            })
            .finally(() => { 
                setLoading(false);
            })
    }


    return (
        <CardOne title="MadGeeks">
            {error && <div className='alert'>*{error}</div>}
                <h2 className="sign-in-title">Sign In</h2>
                {loading && 
                    <div>Loading...</div>
                }
                {!loading &&
                    <>
                        <Form style={'sign-in-form'} handler={validate} >
                        <TextInput display_name={'username'} display_id={'username'} label_style={"form-label"} required={true} autoComplete={true} />
                            <TextInput display_name={'password'} display_id={'password'} label_style={"form-label"} required={true} autoComplete={true} type={"password"}/>
                            <Button value={"login"} style={loading ? 'login disabled': 'loading'} disabled={loading} />
                        </Form>
                        <a href="/register">Register for new account</a>
                    </>
                }
                
        </CardOne>
    )
}

export default SignInForm;