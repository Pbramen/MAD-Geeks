import { ControlInputType } from "components/prefabs/FormComponents"
import { ControlSelectType } from "components/prefabs/FormComponents"
import { ControlTextAreaType } from "components/prefabs/FormComponents"

/*
    Reusable type interfaces for generating the model for form fields.
    Use this as a guide to unify form field component creation
*/

type validator_info<T> = {
    value: T,
    message: string
}
interface validators {
    required?: validator_info<boolean>,
    pattern?: validator_info<string>,
    callBack?: validator_info<(any)=> boolean>
}

interface ControlInputField extends ControlInputType{
    validators?: validators
}

interface ControlSelectField extends ControlSelectType{
    validators?: validators
}

interface ControlTextAreaField extends ControlTextAreaType{
    validators?: validators
}


export type FieldTypes = (
    ControlInputField |
    ControlSelectField |
    ControlTextAreaField
)[]
