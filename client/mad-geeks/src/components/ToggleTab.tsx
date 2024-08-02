import React, { useState } from "react";

export const ToggleTab = ({ children }: {children: React.ReactNode}) => {
    const [display, setDisplay] = useState<boolean>(false);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDisplay((prev) => !prev);
    }

    return (
        <div className="toggle-wrapper">
            <div className="toggle-item">
                <button type="button" onClick={handleOnClick} className={`${display ? "toggle-on" : "toggle-off"}`}>clickme</button>
            </div>
              {display && <div className="hidden-item-wrapper">{children} </div>}
        </div>
    )
}