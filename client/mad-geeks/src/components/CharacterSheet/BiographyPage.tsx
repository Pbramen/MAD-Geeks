
import React, { useEffect, useRef } from "react";
import { Form } from "components/prefabs/FormComponents";
import { useCharacter } from "./useCharacterPayload";
import { CharacterSheetType } from "./CharacterSheetType";

export const BiographyPage = ({ }) => {
    const { payload, setPayload } = useCharacter();
    const first_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const last_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const middle_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const age: React.MutableRefObject<HTMLInputElement> = useRef();

    useEffect(() => {
        console.log(payload?.first_name);
    },[payload])

    // custom function to handle changes for outer fields ONLY
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.name in payload) {
            setPayload((prev) => { 
                return{...prev, [target.name]: first_name.current.value}
            })
        }
    }

    return (
        <section>
            <h3>Biography</h3>
            <Form style={""}>
                <section className="flex flex-column">
                    <label htmlFor="first_name">First Name: </label>
                    <input id="first_name" required ref={first_name} type="text" name="first_name" onChange={handleOnChange} />
                
                    <label htmlFor="middle_name">Middle Name(s): </label>
                    <input id="middle_name" ref={middle_name} type="text" name="middle_name" onChange={handleOnChange} />
                
                    <label htmlFor="last_name">Last Name: </label>
                    <input id="last_name" ref={last_name} type="text" name="last_name" onChange={handleOnChange} />

                    <label htmlFor="age">Age: </label>
                    <input id="age" ref={age} type="number" name="age" onChange={handleOnChange} />
                </section>
                <div className="form-divider" />

                
                <section>
                    <label htmlFor='background'>Background:</label>
                    <input id="background" className="text-box" name="background" placeholder="Please enter tragic backstory here."/>
                </section>
            </Form>
        </section>
        

    )
}