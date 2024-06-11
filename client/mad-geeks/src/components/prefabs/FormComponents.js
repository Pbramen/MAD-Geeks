import { createContext, useContext, useState } from "react"
import { generateNumberAsString } from "../../assets/js/generateString"

export function Form({children, handler="", style="sign-in-form"}) {
    return (
        <>
            <form className={style} onSubmit={handler}>
                {children}
            </form>
        </>
    )
}

export function Button({ value, type="", style="", handler="", disabled=false }) { 
    return (
        <button type={type} className={style} disabled={disabled}>
            {value}
        </button>
    )
}

export function AriaDescribe({ id, style = 'hidden', msg ='', invalid="false"}) {
    return (
        <div id={id} role="alert" className={ style } aria-live="polite" aria-invalid={invalid}>
            {msg}
        </div>
    )
}
// TODO: ADD TYPESCRIPT TO PROJECT
/*
    obj:{
        label_style: <string>,
        display_id: <string>,
        display_name: <string>,
        display_style: <string>
    }
*/
export function TextInput({ display_id, display_name, required,  placeholder = "", label_style = "form-label", input_style = "", type = "text", autoComplete = false, err_msg=null, input_desc=null}) {
    return (
        <>
            {err_msg !== "" && <AriaDescribe id={`${display_id}_err` } className="">{err_msg}</AriaDescribe>}
            <label aria-label={display_name}  htmlFor={display_id} className={label_style}><em>{display_name}:</em></label>
            <input aria-required={required} type={type} className={input_style} id={display_id} name={display_name} autoComplete={autoComplete.toString()} required={required} placeholder={placeholder}></input>
            {input_desc && <span className="input_desc" id={`${display_id}_desc`}>{input_desc}</span>}
        </>
    )
}

const ParentSelect = createContext({});

export function Selector({ id, name, label, children }) {
    const [activeOption, setActiveOption] = useState("");

    const handleChange = (e) => {
        setActiveOption(e.target.options[e.target.selectedIndex].value);
    }

    return (
        <ParentSelect.Provider value={[ activeOption, setActiveOption ]}>
            <label htmlFor={id} label_style="">{label}</label>
            <select onChange={handleChange} name={name} id={id}>
                {children}
            </select>
        </ParentSelect.Provider>
    )
}

export function Options({value, id}){
    const [activeOption, _] = useValidContext(ParentSelect);

    if (activeOption === id) {
        return (
            <option selected key={id} value={value}> {value} </option>
        )
    }
    return (
        <option key={id}  value={value}>{value}</option>
    )
}

function useValidContext(contextProvider) {
    const context = useContext(contextProvider);
    if (!context) {
        throw new Error("Out of Context")
    }
    return context;
}

Selector.Options = Options;

export function DateSelector({ legend }) {
    const month = generateNumberAsString(12, 1);
    const day = generateNumberAsString(31, 1);
    return (
        <fieldset>
            <legend>{legend}</legend>

            
            <Selector id="month" name="month" label="month" >
                {month.map((e) => {
                    
                    return (
                        <Selector.Options value={e} id={e} key={`m${e}`}>
                            {e}
                        </Selector.Options>
                    )
                })}
            </Selector>
            <Selector id="day" name="day" label="day">
                {day.map((e) => {
                    
                    return (
                        <Selector.Options value={e} id={`d${e}`} key={`d${e}`}>
                            {e}
                        </Selector.Options>
                    )
                })}
            </Selector>


            <TextInput id="year" display_id="year" display_name="Year" placeholder="YYYY" type='number'></TextInput>
        </fieldset>
    )
}
