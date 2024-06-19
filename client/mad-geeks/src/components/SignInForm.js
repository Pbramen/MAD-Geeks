import {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, Button } from "./prefabs/FormComponents"
import { CardOne } from "./CardOne";
import { formHeaderOptions } from "../assets/js/fetch";
import { AuthContext } from './context/AuthProvider';
import { Link } from "react-router-dom";
import axios from '../api/axios';

function SignInForm() {
    const nav = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const validate = async function (e) {
        e.preventDefault();
       
        try {
            const response = await axios.post("http://localhost:4000/api/clients/validateAuth",{username: e.target.username.value, password: e.target.password.value}, {withCredentials: true});
            if (response.status === 200 && response.data) {
                if (response.data.status === "SUCCESS" && response.data.msg === "AUTH_OK") {
                    const user = e.target.username.value;
                    const pass = e.target.password.value;
                    const role = response.data?.role;
                    const accessToken = response.data?.accessToken;
                    setAuth({ username: user, password: pass, role: role, accessToken: accessToken });
                    nav('/');
                }
                else if (response.status === 401) {
                    console.log("TODO: make unauthorized page...");
                }
                else{
                    console.log(response);
                    setError(response.data.msg)
                }
            }
        } catch (e) {
            setError("Unexpected Server Error. Please try again later.");
            console.log(e);
        }
    }


    return (
        <CardOne title="MadGeeks">
            {error && <div className='alert'>*{error}</div>}
                <h2 className="sign-in-title">Sign In</h2>
                {loading && 
                    // TODO: REPLACE(GRAY OUT ELEMENTS INSTEAD) 
                    <div>Loading...</div>
                }
                {!loading &&
                    <>
                        <Form style={'sign-in-form'} handleOnSubmit={validate} >
                        <TextInput display_name={'username'} display_id={'username'} label_style={"form-label"} required={true} autoComplete={true} />
                            <TextInput display_name={'password'} display_id={'password'} label_style={"form-label"} required={true} autoComplete={true} type={"password"}/>
                            <Button value={"login"} style="btn-1">Login </Button>
                        </Form>
                        <Link to="/register">Register for new account</Link>
                    </>
                }
                
        </CardOne>
    )
}

export default SignInForm;