
import React, { useEffect, useRef } from "react";
import { CharacterSheetType } from "./CharacterSheetType";
import { ToggleTab } from 'components/ToggleTab';

export const BiographyPage = ({ disabled , useCharacter}: { disabled: boolean, useCharacter: any }) => {
    const [payload, setPayload]= useCharacter;
    const first_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const last_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const middle_name: React.MutableRefObject<HTMLInputElement> = useRef();
    const age: React.MutableRefObject<HTMLInputElement> = useRef();

    useEffect(() => {
        console.log(payload?.demographic?.first_name)
        first_name.current.value = payload.demographic?.first_name;
        last_name.current.value = payload.demographic?.last_name;
        middle_name.current.value = payload.demographic?.middle_name;
    }, [])
    

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.name in payload.demographic) {
            setPayload((prev : CharacterSheetType) => { 
                return {
                    ...prev, demographic: {
                        ...prev.demographic,
                        [target.name] : target.value
                    }
                }
            })
        }
    }

    /**/

    return (
        <React.Fragment>
            { !disabled &&
                <React.Fragment>
                    <fieldset>
                        <legend>Biography</legend>
                        <section className="flex flex-column margin-sm">
                            <div className='grid-o o3x2'>
                                <label htmlFor="first_name">First Name: </label>
                                <label htmlFor="middle_name">Middle Name(s): </label>
                                <label htmlFor="last_name">Last Name: </label>

                                <input className="width-l" id="first_name" required ref={first_name} type="text" name="first_name" onChange={handleOnChange} />
                                <input className="width-l" id="middle_name" ref={middle_name} type="text" name="middle_name" onChange={handleOnChange} />
                                <input className="width-l" id="last_name" ref={last_name} type="text" name="last_name" onChange={handleOnChange} />
                                
                                <label htmlFor="age">Age: </label>
                                <label htmlFor="gender">Gender: </label>
                                <label htmlFor="species">Species:</label>
                                <input id="age" ref={age} type="number" name="age" onChange={handleOnChange} />
                                <input className="width-s" id="gender" type="text"></input>
                                <select className="width-s" id="species">
                                    
                                </select>
                            </div>
                        </section>
                    </fieldset>
                    <fieldset>
                        <ToggleTab>
                            <label htmlFor="backstory">Backstory</label>
                            <textarea></textarea>
                        </ToggleTab>
                    </fieldset>
            </React.Fragment>
            }
        </React.Fragment>
        

    )
}