import { useState, useRef, useEffect} from 'react';
import { Form, Button, TextInput, DateSelector } from './prefabs/FormComponents'
import { CardOne } from './CardOne'
import { formHeaderOptions, handleResponse } from '../assets/js/fetch';
import { checkPassword } from '../assets/js/formValidator';
import { ConfirmationCard } from './ConfirmationPage';
import { usePrevInput } from '../hooks/usePrevInput';

//todo: useReducer for reset instead of state?
export function RegistrationPage() {
    const [otherErrMsg, setErrMsg] = useState("");
    const [userErrMsg, setUserErrMsg] = useState("");
    const [passErrMsg, setPassErrMsg] = useState("");
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [DOBErrMsg, setDOBErrMsg] = useState("");
    const [confirmErrMsg, setConfirmErrMsg] = useState("");

    const {
        inputRefs, 
        addToRefs,
        handleSetState,
        canRegister,
        setCanRegister } = usePrevInput({ 'username': '', 'email': '', 'year': ''}, [userErrMsg, emailErrMsg, DOBErrMsg]);

    const onSubmitForm = async (e) => {
        e.preventDefault();

        const data = JSON.stringify({
            "userLogin": e.target.username.value,
            "password": e.target.password.value,
            "email": e.target.email.value,
            "DOB": e.target.year.value + '-' + e.target.month.value + '-' + e.target.day.value
        })
        
        const headers = formHeaderOptions(data);

        try {
            // jwts are NOT created/checked on register. User must login after registering
            var result = await fetch("http://localhost:4000/api/clients/newUser", headers);
            var json = await result.json();

            if (json.status && json.status === 'ok') {
          
                setCanRegister( () => {return json.action} );
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
                setCanRegister(false);
            }
        } catch (e) {
            //setError("Unexpected server error. Please try again later!");
            console.log(e);    
        }
    }
    if (canRegister !== null && canRegister !== false) {
        return (
            <ConfirmationCard title={"Account successfully createed!"} link={canRegister}>
                Please sign in to continue!
            </ConfirmationCard>
        )
    } 
    return (
        <CardOne>
            <h2 className='sign-in-title'>Register</h2>
           
            <Form handleOnSubmit={onSubmitForm} >
                <TextInput inputHandler={handleSetState } _ref={addToRefs} display_name='username' display_id='username' required={true} input_desc={userErrMsg} ></TextInput>
                <TextInput display_name='password' display_id='password' required={true} type='password' input_desc={passErrMsg}></TextInput>
                <TextInput display_name='confirm password' display_id='confirm_pass' required={true} type='password' input_desc={confirmErrMsg}></TextInput>
                <TextInput inputHandler={handleSetState } _ref={addToRefs} display_name='email' display_id='email' required={true} input_desc={emailErrMsg}></TextInput>
                <DateSelector input_desc={DOBErrMsg} legend="Date of Birth" id="date" _ref={addToRefs} yearHandler={handleSetState} />
                <Button style="active-btn btn-1" type='submit' value='Register' handler={(e) => { e.preventDefault() }} disabled={false} >
                    Register
                </Button>    
  
            </Form>
        </CardOne>
    )
}