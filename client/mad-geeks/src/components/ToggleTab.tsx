import React, { useState, useEffect } from "react";
import up from '../assets/svg/arrow-circle-up-svgrepo-com.svg';
import down from '../assets/svg/arrow-circle-down-svgrepo-com.svg';

export const ToggleTab = ({ children }: {children: React.ReactNode}) => {
    const [display, setDisplay] = useState<boolean>(false);
    const [img, setImage] = useState(up);

    useEffect(() => {
        if (display) {
            setImage(up);
        }
        else {
            setImage(down);
        }
    }, [display])
    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDisplay((prev) => !prev);
    }

    return (
        <div className="flex flex-column toggle">
            <div className="toggle-item">
                <button style={{
                    "background": "transparent",
                    "border": 'none'
                }} type="button" onClick={handleOnClick} className={`${display ? "toggle-on" : "toggle-off"}`}>
                    <img width="20px" height="20px" src={img} alt={'Toggle Tab'} />
                </button>
            </div>
              {display && <div className="hidden-item-wrapper">{children} </div>}
        </div>
    )
}