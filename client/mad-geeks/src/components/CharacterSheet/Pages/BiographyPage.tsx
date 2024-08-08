import React, { useContext, useEffect, useRef} from "react";
import { usePagination } from "components/Pagination/usePagination";

// Format/Styled Components
import { GridCellForm as GridCell } from '../GridCellForm'
import { FieldSet } from "components/FieldSet";

import { demographic } from "../CharacterSheetType";
import { useDemoFields } from "components/DemoFields";
import {
    ControlInput,
    ControlInputType,
    ControlSelectType,
    ControlTextArea,
    ControlTextAreaType
} from "components/prefabs/FormComponents";

// validators
import {
    isDefined,
    maxLength,
    minLength,
    RETURN_CODE
} from "assets/js/formValidator";

// modularized form for setting up character sheet demographic information.
export const BiographyPage = ({ disabled }: { disabled: boolean }) => {
    // model custom hook containing all data needed to set up each form field.
    const {
        demographic_err,
        setDemographic_err,
        demographic,
        setDemographic,
        bioFields,
        backgroundFields
    } = useDemoFields()
    // custom hook for navigation/history tracking.
    const {
        current_page,
        setCurrent_Page,
        setMax_page
    } = usePagination();

    // validation for each field
    const validationHandler = () => {
        const result = true;
        const demo_err = {}
        const back_err = {}
        // look up table that contains all validations for each field
        // check for all required elements:
        if (isDefined("first_name", demographic.biography) === RETURN_CODE.FAILURE) demo_err['first_name'] = "Please fill out this field.";
        if (isDefined("backstory", demographic.background) === RETURN_CODE.FAILURE) back_err['backstory'] = 'Please fill out this field';
        setDemographic_err((prev) => { 
            return {
                ...prev,
                biography: {
                    ...prev.biography, ...demo_err
                },
                background: {
                    ...prev.background, ...back_err
                }
            }
        })
        return result;
    }
    
    // handles state change on user keyboard event.
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        console.log("this is working...")
        console.log(target.name);
        if (target.name in demographic) {
            console.log(target.name, " detected... changing to: ", target.value)
            setDemographic((prev: demographic) => {
                return {
                    ...prev, [target.name]: target.value
                }
            })
        }
    }
    // TODO: add form validation 
    const handleFormSubmit = (e: React.FormEvent) => { 
        const target = e.currentTarget;
        const a = validationHandler();

        e.preventDefault();
    }

    const list = bioFields.map((e, index) => {
        const htmlTag = e.html;
        const key = 'f_' + index;
        switch (htmlTag) {
            case "input":
                return (
                    <GridCell>
                        <ControlInput key={key} {...e as ControlInputType} dispatcher={handleOnChange} />
                    </GridCell>
                )
                break;
            case "select":
                return (
                    <GridCell>
                        <ControlSelectType key={key} {...e as ControlSelectType} dispatcher={handleOnChange} />
                    </GridCell>
                )
                break;
            case "textarea":
                return (
                    <GridCell>
                        <ControlTextArea key={key} {...e as ControlTextAreaType} dispatcher={handleOnChange} />
                    </GridCell>
                )
                break;
        }
    })

    const tab2 = backgroundFields.map((e, index) => {
        const key = 'b_' + index;
        return (
            <GridCell>
                <ControlTextArea key={key} {...e as ControlTextAreaType} dispatcher={handleOnChange} />
            </GridCell>
        )
    })

    return (
        <React.Fragment>
            { !disabled &&
                <React.Fragment>
                    <form className="flex flex-column main-body" onSubmit={(handleFormSubmit)} >
                        <FieldSet state={demographic_err.biography} legend_title="Biography" toggle={true} description="Set your character's name, age, species, etc">             
                            <div className='grid-o o3x2 margin-sm'>
                                {list}
                            </div>
                        </FieldSet > 
                        <FieldSet state={demographic_err.background} legend_title="Biography" toggle={true} description="Set your character's name, age, species, etc">
                            {tab2}
                        </FieldSet>
                    <button type="submit" onSubmit={(e: React.FormEvent) => e.preventDefault()} className="btn-1">Next</button>
                </form>
            </React.Fragment>
            }
        </React.Fragment>
        

    )
}
 {/* <GridCell>
                <label htmlFor="First Name">First Name: </label>
                <input id="first_name" className="width-l" required maxLength={4096} type="text" name="middle_name" onChange={handleOnChange} value={demographic?.first_name} />
                
            </GridCell>
            
            <GridCell>
                <label htmlFor="middle_name">Middle Name(s): </label>
                <input id="middle_name" required className="width-l" maxLength={4096} type="text" name="middle_name" onChange={handleOnChange} value={demographic?.middle_name} />
                
            </GridCell>

            <GridCell>
                <label htmlFor="last_name">Last Name: </label>
                <input id="last_name" className="width-l"  maxLength={4096} type="text" name="last_name" onChange={handleOnChange} value={demographic?.last_name} />
                
            </GridCell>  
                <label htmlFor="age">Age: </label>
                <label htmlFor="gender">Gender: </label>
                <label htmlFor="species">Species:</label>
                
                <input id="age" type="number" name="age" onChange={handleOnChange} value={demographic?.age} />
                    
                <input id="gender" className="width-s" type="text"></input>
                <select id="species" className="width-s" name="species" defaultValue={demographic?.species} onChange={handleOnChange} >
                    <option value="dragonborn">Dragonborn</option>
                    <option value="dwarf-hill-dwarf">Dwarf</option>
                    <option value="elf-high-elf">Elf</option>
                    <option value="gnome-rock-gnome">Gnome</option>
                    <option value="half-elf">Half-Elf</option>
                    <option value="half-orc">Half-Orc</option>
                    <option value="halfling">Halfling</option>
                    <option value="human">Human</option>
                    <option value="tiefling">Tiefling</option>
                    <option value="custom">Custom</option>
                </select>
                    
        </div>
        <hr style={{
            'margin': "0px 10px",
            'border': "1px solid black"
        }} />
        <div className="flex flex-column margin-sm">
            <label htmlFor='aliases'>Nicknames:</label>
            <input className="width-l" type="text" />
        </div>
    </FieldSet>
    <FieldSet legend_title="Background" description="(Optional) Record your character's backstory and previous relationships." toggle={true}>
        <div  className="flex flex-column margin-sm">
            <label htmlFor="architype">Architype</label>
            <select id="architype"/>
        </div>
        <div className="flex flex-column margin-sm">
            <label htmlFor="backstory">Backstory</label>
            <textarea id="backstory"name="backstory" value={demographic.background.backstory} onChange={handleOnChange} />
        </div>
        <div className="flex flex-column margin-sm">
            <label htmlFor="allies">Allies</label>
            <textarea id="allies" name="allies" value={demographic.background.allies} onChange={handleOnChange} />
        </div>
        <div className="flex flex-column margin-sm">
            <label htmlFor="enemies">Enemies</label>
            <textarea id="enemies"  name="enemies" value={demographic.background.enemies} onChange={handleOnChange}/>
        </div>
        <div className="flex flex-column margin-sm">
            <label htmlFor="fraction">Alliances</label>
            <textarea id="fraction" name="fraction"  onChange={handleOnChange} value={demographic.background.fraction}/>
        */}