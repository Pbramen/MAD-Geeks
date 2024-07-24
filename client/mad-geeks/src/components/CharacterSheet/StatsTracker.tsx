import React from 'react';
import { useCharacter } from "./useCharacterPayload"

const StackTracker = () => {
    const { payload, setPayload } = useCharacter();

    return (
        <aside className="flex flex-row">
            <ul className="row-banner">
                <li>
                    <div className="image-banner">
                        <image />
                        <div></div>
                    </div>
                </li>
                <li>
                    <div>
                        <div>{ /* payload.stat.str TOTAL here...*/}</div>
                        <div>STR</div>
                        <div>{/* bonus here..*/}</div>
                    </div>
                    
                </li>
            </ul>

        </aside>
    )
}