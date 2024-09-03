import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import up from '../assets/svg/arrow-circle-up-svgrepo-com.svg';
import down from '../assets/svg/arrow-circle-down-svgrepo-com.svg';
import get from 'lodash.get';

// Toggle tab that also opens up if and error was detected!
// if state is null, then no error is present!
export const ToggleTab = ({ state=null, path, children}: {state?: any, path?: string, children: React.ReactNode} ) => {
    const [display, setDisplay] = useState<boolean>(true);
    const [img, setImage] = useState(up);
    const imageDisabled: React.MutableRefObject<HTMLImageElement> = useRef(null);
    const expandableTab: React.MutableRefObject<any> = useRef();

    // opens the tab when the state changes relevant to the tab!
    useEffect(() => {
        if (state && path && get(state, path)) {
            setDisplay(true);
        }
    }, [state])

    // open / close animation.
    useEffect(() => {
        display ? setImage(()=>up) : setImage(()=>down);
        if (expandableTab.current) {
            const max_height = expandableTab.current.scrollHeight;
            expandableTab.current.maxHeight = display ? `${max_height}px` : `100px`;
        }
    }, [display])

    // close on click => if state, can only close if valid 
    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if ((state === null || state === '') || (get(state, path)?.size === 0)) {
            setDisplay((prev) => !prev);
        }
    }
    const onLoad = (e) => {
        const target = e.target as HTMLImageElement;
        // prevent parent from attempting to modify image...
        target.style.color = 'unset';
    }

    return (
        <div ref={expandableTab}  className={`flex flex-column toggle ${ display ? "expand" : "collapse"}`}>
                <div className="toggle-item">
                    <button style={{
                        "background": "transparent",
                        "border": 'none'
                    }} type="button" onClick={handleOnClick} className={`${display ? "toggle-on" : "toggle-off"}`}>
                        <img style={{ color: "transparent" }} onLoad={onLoad} onError={onLoad} ref={imageDisabled} width="30px" height="30px" src={img} alt={'Toggle Tab'} />
                    </button>
                </div>
            
            <div className={display ? "" :`hidden-item-wrapper`}>{children} </div>
        </div>
    )
}