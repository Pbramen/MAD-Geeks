import { Controller } from "react-hook-form";
import { useState } from 'react';

type DynamicControllerType = {
    html: 'input' | 'select' | 'textarea',
    validation?: any,
    name: string,
    control: any,
    path: string,
    label: string,
    onChangeHandler?: (any) => void
    options?: string[],
    [key: string]: any // remainder 
}

// ...rest === field from Controller render!
// path = path.to.error.mapping used for ui notification on failure.
export const DynamicController = ({  errors, html, validation, name, control, path, options, label, divStyle, defaultValue, onChangeHandler= (()=>{}), ...rest }:DynamicControllerType ) => {
    const errorID = 'err_' + name;
    const [previewImg, setPreviewImg] = useState("");


    const handleImageUpload = (e: any) => {
        const files = e.target?.files?.[0]
        const filePath = URL.createObjectURL(files);
        console.log("handling impage upload...")
        setPreviewImg(filePath.toString());
    }
    const input = (field: any, fieldError = null, onChange) => {
        
        // if fieldError is defined, then alert the user!
        switch (html) {
            case 'select':
                return (
                    <select name={name} aria-errormessage={errorID} aria-invalid={fieldError ? true : false} id={name} onChange={e => {onChange(e); onChangeHandler(e)}} {...field} {...rest}>
                        {options &&
                            options.map((option) => {
                            
                                return (<option key={option} value={option}>{option}</option>)
                            })
                        }
                    </select>
                );
            
            case 'textarea':
                return (
                    <textarea name={name} aria-invalid={fieldError ? true : false } aria-errormessage={errorID} id={name} onChange={e => {onChange(e); onChangeHandler(e)}} {...field} {...rest}/>
                )
            case 'input':
                // CAN ONLY BE USED IN PARENT COMPONENT! (if used in child, need to revokeURL EACH time a page is switched!)
                if (rest.type === 'img') {
                    return (
                        <>
                            <input style={{ color: 'black' }} name={name} value='' aria-invalid={fieldError ? true : false} aria-errormessage={errorID} id={name} onChange={(e) => { onChange(e); handleImageUpload(e)}}  {...rest} />
                            {previewImg && <img src={previewImg} /> }
                        </>
                    )
                }
            default:
                return (
                    <input name={name} aria-invalid={fieldError ? true : false} aria-errormessage={errorID} id={name} onChange={e => {onChange(e); onChangeHandler(e)}} {...field} {...rest}/>
                )
        }
    }

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ''}
            rules={{...validation} }
            render={({ field: {value, onChange, onBlur}, fieldState }) => {
                return (
                    <div className="flex flex-column" style={divStyle}>
                        <label htmlFor={name}>{label}</label>
                        {input({value, onBlur }, fieldState.error, onChange)}
                        {
                            fieldState.error && 
                            <span className="alert-text" aria-live='polite'>{fieldState.error.message}</span>
                        }
                    </div>
                )
            }}
        />
    )
}