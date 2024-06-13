import { createContext, useContext, useState, fowardRef } from "react"
import { generateNumberAsString } from "../../assets/js/generateString"



export function Form({children, handleOnSubmit, handleOnChange, style="sign-in-form", formRef}) {
    return (
        <>
            <form ref={formRef} className={style} onSubmit={handleOnSubmit} onChange={handleOnChange}>
                {children}
            </form>
        </>
    )
}

export function Button({ children, type="", style="", disabled=false }) { 
    if (disabled) {
        return (
            <button type={type} className={style} disabled>
                {children}
            </button>
        )
    }
    return (
        <button type={type} className={style} disabled={disabled}>
            {children}
        </button>
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
export function TextInput({ display_id, display_name, required, _ref=null, placeholder = "", label_style = "form-label", input_style = "", type = "text", autoComplete = false, desc = null, input_desc = '', inputHandler = () => { } }) {

    const aria_label = `${display_id}_desc`;
    const invalid = input_desc !== '';
    const aria_style = !invalid ? 'hidden' : 'aria-err';
    
    return (
        <div className="form-item">
            <label aria-label={display_name}  htmlFor={display_id} className={label_style}><em>{display_name}:</em></label>
            { input_desc &&
                <input onChange={inputHandler} ref={_ref} aria-invalid={invalid} aria-describedby={aria_label} aria-required={required} type={type} className={input_style} id={display_id} name={display_name} autoComplete={autoComplete.toString()} required={required} placeholder={placeholder}></input>
            }
            { !input_desc &&
                <input onChange={inputHandler} ref={_ref} aria-invalid={invalid} aria-required={required} type={type} className={input_style} id={display_id} name={display_name} autoComplete={autoComplete.toString()} required={required} placeholder={placeholder}></input>
            }
            <div role="alert" aria-live="polite" className={aria_style} id={aria_label}>{`* ${input_desc}`}</div>
        </div>
    )
}

const ParentConext = createContext({});
export function Selector({ id, name, label, children }) {
    const [activeItem, setActiveItem] = useState("");

    const handleChange = (e) => {
        const active_item = e.target.options[e.target.selectedIndex].value;
        setActiveItem(active_item)
    }

    return (
        <ParentConext.Provider value={[activeItem, setActiveItem]}>
            <label htmlFor={id} label_style="">{label}</label>
            <select onChange={handleChange} name={name} id={id} value={activeItem}>
                {children}
            </select>
        </ParentConext.Provider>
    )
}

/**
 * TODO: fixe useValidContext for Options to be useable in only Selector, NOT DatContext.
 */

export function Options({value, id}){
    useValidContext(ParentConext);
    return (
        <option key={id} value={value}>{value}</option>
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

export function DateSelector({ legend , _ref, input_desc, yearHandler}) {


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

            <TextInput input_desc={input_desc} inputHandler={yearHandler} _ref={_ref} id="year" display_id="year" display_name="Year" placeholder="YYYY" type='number'></TextInput>
        </fieldset>
    )
}
