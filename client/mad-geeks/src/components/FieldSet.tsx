import React from 'react';
import { ToggleTab } from 'components/ToggleTab';

export const FieldSet = ({ state, children, legend_title, description='', toggle=false }: { state: any, children: React.ReactNode, description?: string,  legend_title: string, toggle?: boolean }) => {
    return (
        <fieldset className="form-section">
            <legend className="form-section-title">{legend_title}</legend>
            {toggle ? <ToggleTab state={state} description={description}>{children}</ToggleTab> : children}
        </fieldset>
    )
}

