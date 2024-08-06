import React from 'react';
import { ToggleTab } from 'components/ToggleTab';

export const FieldSet = ({ children, legend_title, description='', toggle=false }: { children: React.ReactNode, description?: string,  legend_title: string, toggle?: boolean }) => {
    return (
        <fieldset className="form-section">
            <legend className="form-section-title">{legend_title}</legend>
            {toggle ? <ToggleTab description={description}>{children}</ToggleTab> : children}
        </fieldset>
    )
}

