import { useState } from 'react';
import { Form, Button, TextInput, DateSelector } from './prefabs/FormComponents'
import { CardOne } from './CardOne'
import { formHeaderOptions, handleResponse } from '../assets/js/fetch';
import { useNavigate } from 'react-router-dom';

export function RegistrationPage() {
    const nav = useNavigate();
    const [fields, setFields] = useState({
        username: '',
        password: '',
        confirm: '',
        email: ''
    })
    const [otherErrMsg, setErrMsg] = useState("");
    const [userErrMsg, setUserErrMsg] = useState("");
    const [passErrMsg, setPassErrMsg] = useState("");
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [DOBErrMsg, setDOBErrMsg] = useState("");
    const [confirmErrMsg, setConfirmErrMsg] = useState("");

    const canSubmit = fields.password === fields.confirm && fields.password !== "";
    // perform validators here....


    //input descriptions here
    // ⚪ 🔴 🟢

    const user_def = ["⚪ Min length 6"];

    const onBlurPass = (e) => {
        console.log(e.target.value);
        setFields({ ...fields, confirm: e.target.value });
    }
    const onBlurConfirm = (e) => {
        setFields({...fields, password: e.target.value})
    }
    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = JSON.stringify({
            "userLogin": e.target.username.value,
            "password": e.target.password.value,
            "email": e.target.email.value,
            "DOB": e.target.year.value + '-' + e.target.month.value + '-' + e.target.day.value
        })
        
        const headers = formHeaderOptions(data);

        try{
            var result = await fetch("http://localhost:4000/api/clients/newUser", headers);

            var json = await result.json();
            console.log(json);
            if (json.status && json.stats === 'ok') {
                nav('/');
            }
            else if (json.errors && json.errors[0]) {
                let n = json.errors.length;
                let i;

                //reset all errors
                setUserErrMsg("");
                setPassErrMsg("");
                setDOBErrMsg("");
                setEmailErrMsg("");
                setConfirmErrMsg("");

                setFields({
                    username: e.target.username.value,
                    password: e.target.password.value,
                    confirm: "",
                    email: e.target.email.value
                })

                json.errors.forEach(element => {
                    if (element.path === null || element.message === null) {
                        throw new Error("Unexpected Error. Please Try Again later.");
                        // TODO: LOG ERROR HERE:
                    }
                    switch (element.path) {
                        case "userLogin":
                            setUserErrMsg(element.message);
                            break;
                        case "password":
                            setPassErrMsg(element.message);
                            break;
                        case "email":
                            setEmailErrMsg(element.message);
                            break;
                        case "DOB":
                            setDOBErrMsg(element.message);
                            break;
                        default:
                            setErrMsg(element.message);
                            // set for unexpected error
                            break;
                    }
                });
            }
        } catch (e) {
            //setError("Unexpected server error. Please try again later!");
            console.log(e);    
        }
    }
    return (
        <CardOne>
            <h2 className='sign-in-title'>Register</h2>
           
            <Form handler={onSubmitForm}>
                <TextInput display_name='username' display_id='username' required={true} placeholder={fields.username} input_desc={userErrMsg} ></TextInput>
                <TextInput inputHandler={ onBlurPass } display_name='password' display_id='password' required={true} type='password' placeholder={fields.password} input_desc={passErrMsg}></TextInput>
                <TextInput inputHandler={ onBlurConfirm } display_name='confirm password' display_id='confirm_pass' required={true} type='password' placeholder={fields.confirm} input_desc={confirmErrMsg}></TextInput>
                <TextInput display_name='email' display_id='email' required={true} placeholder={fields.email} input_desc={emailErrMsg}></TextInput>
                <DateSelector legend="Date of Birth" id="date"/>
                {canSubmit &&
                    <Button style="active-btn" type='submit' value='Register' handler={(e) => { e.preventDefault() }} disabled={false} >
                        Register
                    </Button>    
                }
                {!canSubmit && 
                    <Button type="submit" disabled={true} style="disabled-btn">
                        Register
                    </Button>
                }
            </Form>
        </CardOne>
    )
}