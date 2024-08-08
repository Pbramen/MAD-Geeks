import { FieldTypes } from "./Types/formFields";
import { useErrors } from "./CharacterSheet/Pages/useErrors";
import { useCharacter } from "./CharacterSheet/useCharacterPayload";

export const useDemoFields = () => {
    const { demographic_err, setDemographic_err } = useErrors();
    const { demographic, setDemographic } = useCharacter();

    const textStyle = "width-l"
    const bioFields: FieldTypes = [
        {
            html: 'input',
            id: 'first-name',
            label_title: '** First Name:',
            errID: 'err_first-name',
            errorMessage: demographic_err?.biography?.first_name,
            style: textStyle,
            type: 'text',
            state: demographic?.biography?.first_name,
            name: 'first_name',
            constrains: {
                maxLength: 32
            },
            validators: {
                required: {value: true, message: "Please enter your character's first name."}
            }
        }, 
        {
            html: 'input',
            id: 'middle-name',
            label_title: 'Middle Name:',
            errID: 'err_middle-name',
            errorMessage: demographic?.biography?.middle_name ,
            style: textStyle,
            type: 'text',
            state: demographic?.biography?.middle_name,
            name: 'middle_name'
        },
        {
            html: 'input',
            id: 'last-name',
            label_title: 'Last Name:',
            errID: 'err_last-name',
            errorMessage: demographic?.biography?.last_name ,
            style: textStyle,
            type: 'text',
            state: demographic?.biography?.last_name,
            name: 'last_name'
        }
    ]

    const backgroundFields: FieldTypes = [{
        html: 'textarea', 
        id: 'backstory',
        name: 'backstory',
        errID: 'err_backstory',
        label_title: "Backstory",
        state: demographic?.background?.backstory,
        errorMessage: demographic_err?.background?.backstory,
        validators: {
            required: {
                value: true,
                message: "Please fill out this form!"
            }
        }
    }]
    return {
        demographic_err,
        setDemographic_err,
        demographic,
        setDemographic,
        bioFields,
        backgroundFields
    }
}