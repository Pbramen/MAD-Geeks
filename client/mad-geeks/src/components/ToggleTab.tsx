import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import up from '../assets/svg/arrow-circle-up-svgrepo-com.svg';
import down from '../assets/svg/arrow-circle-down-svgrepo-com.svg';

export const ToggleTab = ({ children, description }: {children: React.ReactNode, description: string}) => {
    const [display, setDisplay] = useState<boolean>(true);
    const [img, setImage] = useState(down);
    const expandableTab: React.MutableRefObject<any> = useRef();

    useEffect(() => {
        display ? setImage(()=>up) : setImage(()=>down);

        if (expandableTab.current) {
            const max_height = expandableTab.current.scrollHeight;
            expandableTab.current.maxHeight = display ? `${max_height}px` : `50px`;
        }
    }, [display])

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDisplay((prev) => !prev);
    }

    return (
        <div ref={expandableTab}  className={`flex flex-column toggle ${ display ? "expand" : "collapse"}`}>
            <div className="flex flex-row" style={{
                "justifyContent" : 'space-between'
            }}>
                <summary style={{ "fontWeight": "bold", "textAlign": "center", "flexGrow": "1", "paddingTop": "20px", "fontSize": "1.2em"}}>{description}</summary>
                <div className="toggle-item">
                    <button style={{
                        "background": "transparent",
                        "border": 'none'
                    }} type="button" onClick={handleOnClick} className={`${display ? "toggle-on" : "toggle-off"}`}>
                        <img width="30px" height="30px" src={img} alt={'Toggle Tab'} />
                    </button>
                </div>
            </div>
              {display && <div className="hidden-item-wrapper">{children} </div>}
        </div>
    )
}