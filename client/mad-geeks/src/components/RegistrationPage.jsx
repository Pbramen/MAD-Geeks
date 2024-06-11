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
        pass_check: false,
        email: ''
    })
    const [errors, setError] = useState(null);

    //input descriptions here
    const user_desc = "Username must have at minimun length of 6. May contain letters or numbers.";
    const pass_desc = "Password must have at minimun length of 6 and contains at least one lowercase letter, one lowercase number, one symbol, and one number";
    const email = "Please enter a valid email address."
    
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
                nav('/regsiter?success');
            }
            else if (json.errors && json.errors[0]) {
                console.log(json.errors[0].message);
                setError(json.errors[0].message);
            }
        } catch (e) {
            setError("Unexpected server error. Please try again later!");
            console.log(e);    
        }
    }
    return (
        <CardOne>
            <h2 className='sign-in-title'>Register</h2>
            {errors && <p className='alert'>{errors}</p>}
            <Form handler={onSubmitForm}>
                <TextInput display_name='username' display_id='username' required={true} placeholder={fields.username} input_desc=""></TextInput>
                <TextInput display_name='password' display_id='password' required={true} type='password' placeholder={fields.password}></TextInput>
                <TextInput display_name='confirm password' display_id='confirm_pass' required={true} type='password'></TextInput>
                <TextInput display_name='email' display_id='email' required={true} placeholder={fields.email}></TextInput>
                <DateSelector legend="Date of Birth" id="date"/>
                <Button type='submit' value='Register' handler={(e) => { e.preventDefault() }} />
            </Form>
        </CardOne>
    )
}