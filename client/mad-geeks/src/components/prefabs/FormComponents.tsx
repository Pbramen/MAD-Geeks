import React, {createContext, ReactNode, useContext, useState } from "react"
import { generateNumberAsString } from "../../assets/js/generateString"

interface FormType{
    children: ReactNode,
    handleOnSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void,
    handleOnChange?: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void,
    style?: string
}   
export function Form({children, handleOnSubmit, handleOnChange, style="sign-in-form"}: FormType) {
    return (
        <React.Fragment>
            <form className={style} onSubmit={handleOnSubmit} onChange={handleOnChange}>
                {children}
            </form>
        </React.Fragment>
    )
}


interface Button{
    children?: ReactNode,
    type: 'submit' | 'reset' | 'button',
    style: string,
    disabled?: boolean
}

export function Button({ children, type, style="", disabled=false } : Button) { 
    if (disabled) {
        return (
            <button type={type} className={style} disabled>
                {children }
            </button>
        )
    }
    return (
        <button type={type} className={style} disabled={disabled}>
            {children}
        </button>
    )
}


interface TextInputTypes {
    display_id: string,
    display_name: string,
    required?: boolean,
    _ref?: string,
    placeholder?: string,
    label_style?: string,
    id?: string,
    input_style?: string,
    type?: "text" | "number" | "password" ,
    autoComplete?: boolean,
    desc?: string,
    input_desc?: string,
    inputHandler?: (e)=> Promise<void>
}
export function TextInput({ display_id, display_name, required, _ref=null, placeholder = "", label_style = "form-label", input_style = "", type = "text", autoComplete = false, desc = null, input_desc = '', inputHandler = null }: TextInputTypes) {

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

// edit this to extend available options.
type single_option = string

interface OptionsType  {
    value: single_option,
    id: string,
    children: ReactNode
}

interface SelectorTypes  {
    id: string,
    name: string, 
    label: string,
    children: ReactNode,
    Options?: OptionsType
}


const ParentConext = createContext<{}>({});
export function Selector({ id, name, label, children }: SelectorTypes)  {
    const [activeItem, setActiveItem] : [single_option, React.Dispatch<single_option>] = useState('');

    const handleChange = (e) => {
        const active_item = e.target.options[e.target.selectedIndex].value;
        setActiveItem(active_item)
    }

    return (
        <ParentConext.Provider value={[activeItem, setActiveItem]}>
            <label htmlFor={id} >{label}</label>
            <select onChange={handleChange} name={name} id={id} value={activeItem}>
                {children}
            </select>
        </ParentConext.Provider>
    )
}

/**
 * TODO: fixe useValidContext for Options to be useable in only Selector, NOT DatContext.
 */

export function Options({children, value, id}: OptionsType){
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

interface DateSelectorTypes{
    legend: string, 
    _ref: any
    input_desc?: string,
    yearHandler: (e) =>  Promise<void>
}
export function DateSelector({ legend , _ref, input_desc, yearHandler}: DateSelectorTypes) {


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

            <TextInput id="year" display_id="year" display_name="Year" placeholder="YYYY" type='number' input_desc={input_desc} inputHandler={yearHandler} _ref={_ref} ></TextInput>
        </fieldset>
    )
}
