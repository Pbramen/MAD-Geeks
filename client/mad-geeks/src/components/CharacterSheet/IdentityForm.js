import { Form, TextInput, Button, Selector } from "../prefabs/FormComponents";
//import handler function here...
import { useCharaContext } from "../context/CharaContext";

export function IdentityForm() {
    const {
        page,
        setPage,
        page_headers,
        fields,
        setFields
    } = useCharaContext();
    
    return (
        <Form >
            <TextInput name="First Name" required={true} />
            <TextInput name="Middle Name" required={false} />
            <TextInput name="Last Name" required={true} />
            <Selector id="class" name="class" label="Class" list={[]} />
            <TextInput name="Level" type="number" />
            <TextInput name="Age" type="number" />
            
        </Form>
    )
}