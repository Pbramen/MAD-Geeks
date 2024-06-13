import { useRef, useState, useEffect } from "react";

export const usePrevInput = (list, dependency) =>{
    const inputRefs = useRef({});
    const inputValues = useRef(list) ;
    const [canRegister, setCanRegister] = useState(null);


    // on first render or when dependency list changes....
    useEffect(() => {
        if (canRegister === false ) {
            //formSubmission has failed.
            Object.entries(inputRefs.current).forEach(([name, e]) => {
                e.value = inputValues.current[name];
            })
        }
    }, [...dependency, canRegister])

    const addToRefs = (e) => {
        if (e) {
            const name = e.id;
            if (inputRefs && !inputRefs.current.name) {
                inputRefs.current = { ...inputRefs.current, [name]: e }
            }
        }
    }

    const handleSetState = (e) => {
        if (e) {
            const name = e.target.id;
            if (inputValues.current[name] !== null) {
                inputValues.current[name] = e.target.value;               
            }
        }
    }
    return {
        inputRefs, 
        addToRefs,
        resetInput,
        handleSetState,
        canRegister,
        setCanRegister
    }
}
 