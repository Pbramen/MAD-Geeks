import React, { ReactNode } from 'react';

export const CardTwo = ({ empty, children }: {empty?: boolean, children?: ReactNode}) => {
    return (
        <li className={`landscape-card ${empty && 'empty'}`}>
            {children}
        </li>
    )
}