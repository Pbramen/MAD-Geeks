import React from 'react';

export const CardTwo = ({ empty  }: {empty?: boolean}) => {
    return (
        <li className={`landscape-card ${empty && 'empty'}`}>
        
        </li>
    )
}