import { useState, useRef, useEffect } from 'react';


// small round error message to be place at the top.
export const ErrorMessage = ({ message, onClick }: { message: string, onClick: (e: React.MouseEvent)=> void}) => { 
    const [toggleOff, setToggleOff] = useState<boolean>(false);
    const targetFocus: React.MutableRefObject<HTMLDivElement> = useRef(null);
    {
        return (
            <div className="small-error" >
                <button type='button' className="circle-btn" onClick={onClick}>X</button>
                <span aria-live="polite" className="sm-font white-text text-center normalize-pointer">{message}</span>
            </div>
        )
    }
    return <></>
}