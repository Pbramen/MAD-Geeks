export function Form({children, autocomplete="on", handler="", style=""}) {
    return (
        <>
            <form className={style} onSubmit={handler} autocomplete={autocomplete}>
                {children}
            </form>
        </>
    )
}

export function Button({ value, type="", style="", handler="" }) { 
    return (
        <button type={type} className={style}>
            {value}
        </button>
    )
}

export function TextInput({name, required, label_style="", input_style="", type="text"}) {
    return (
        <>
            <label htmlFor={name} className={label_style}><em>{name}:</em></label>
            <input type={type} className={input_style} id={name} name="username" required={required}></input>
        </>
    )
}

export function Selector({ id, name, label, list }) {
    const options = list.map((e) => { 
        <option value={e.value}>{e.name}</option>
    })

    return (
        <>
        <label htmlFor={id} label_style="">{label}</label>
        <select name={name} id={id}>
            {options}            
            </select>
        </>

    )
}