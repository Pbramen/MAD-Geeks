import React from 'react';
import { ToggleTab } from 'components/ToggleTab';

export const FieldSet = ({ state, children, legend_title, description='', path, toggle=false }: { state: any, children?: React.ReactNode, description?: string, path: string,  legend_title: string, toggle?: boolean }) => {
    // temporarily disabled toggle:
    
    return (
        <fieldset className="form-section">
            <legend className="form-section-title">{legend_title}</legend>
            <div className="flex flex-row text-wrapper">
                <p className="sec-description">{description}</p>
            </div>
            {toggle ? <ToggleTab state={state} path={path}>{children}</ToggleTab> : children}
        </fieldset>
    )
}

