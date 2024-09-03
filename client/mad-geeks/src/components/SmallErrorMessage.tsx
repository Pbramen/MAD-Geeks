import { useState, useRef, useEffect } from 'react';


// small round error message to be place at the top.
export const ErrorMessage = ({ message }: { message: string }) => { 
    const [toggleOff, setToggleOff] = useState<boolean>(false);
    const targetFocus: React.MutableRefObject<HTMLDivElement> = useRef(null);
    {
        return (
            <div className="flex small-error" >
                <button type='button' className="circle-btn" >X</button>
                <span aria-live="polite" className="sm-font white-text text-center">{message}</span>
            </div>
        )
    }
    return <></>
}