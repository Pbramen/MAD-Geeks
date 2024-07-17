import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, Button } from "./prefabs/FormComponents"
import { CardOne } from "./CardOne";
import { AuthContext, AuthDispatch } from "./context/AuthContext";
import { Link } from "react-router-dom";
import axios from '../api/axios';
import { StringMappingType } from "typescript";


interface err_object {
    status: string | number,
    msg: string,
    link?: string,
}

function SignInForm() {
    const nav = useNavigate();
    const { setAuth } = useContext(AuthContext) as AuthDispatch;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const validate = async function (e) {
        e.preventDefault();
        const params = {
            username: e.target.username.value,
            password: e.target.password.value
        }

        await axios.post("http://localhost:4000/api/clients/login", params, { withCredentials: true })
            .then(res => {
                console.log(res);
                if (res.data == undefined || (res.status === undefined && typeof res.status !== 'number')) {
                    throw new Error("Invalid status response")
                }
                setAuth({
                    username: res.data.username,
                    roles: res.data.roles,
                    accessToken: res.data.accessToken
                });
                nav('/')
            }).catch(err => {
                if (err.response !== undefined) {
                    if (err.response.data && "status" in err.response.data && "msg" in err.response.data) {
                        const res = err.response;
                        console.log(res);
                        if (res.status === 404) {
                            console.log("uwuw")
                            nav('/register?msg=Account not found');
                        }
                        setError(err.response.data.msg);   
                    }
                }
        })
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
                            <Button type="submit" style="btn-1">Login </Button>
                        </Form>
                        <Link to="/register">Register for new account</Link>
                    </>
                }
                
        </CardOne>
    )
}

export default SignInForm;