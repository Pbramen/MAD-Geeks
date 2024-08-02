
import React, { useEffect, useRef } from "react";
import { CharacterSheetType } from "./CharacterSheetType";
import { FieldSet } from "components/FieldSet";

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
                    <FieldSet legend_title="Biography">             
                            <div className='grid-o o3x2 margin-sm'>
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
                        </FieldSet>
                    <FieldSet legend_title="Background" toggle={true}>
                        <p className="margin-sm">(Optional) Information regarding your background</p>
                        <div className="flex flex-column margin-sm">
                            <label htmlFor="backstory">Backstory</label>
                            <textarea id="backstory" placeholder="Describe your character's tragic backstory here." />
                        </div>
                        <div className="flex flex-column margin-sm">
                            <label htmlFor="allies">Allies</label>
                            <textarea id="allies" placeholder="Enter a list of all friendly faces"/>
                        </div>
                        <div className="flex flex-column margin-sm">
                            <label htmlFor="backstory">Enemies</label>
                            <textarea id="enemies" placeholder="Enter a list of all enemies."/>
                        </div>
                        <div className="flex flex-column margin-sm">
                            <label htmlFor="backstory">Alliances</label>
                            <textarea id="alliances" placeholder="List all fractions, organizations or sectors."/>
                        </div>
                    </FieldSet>
            </React.Fragment>
            }
        </React.Fragment>
        

    )
}