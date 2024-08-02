import React from 'react';
import { ToggleTab } from 'components/ToggleTab';

export const FieldSet = ({ children, legend_title, toggle=false }: { children: React.ReactNode, legend_title: string, toggle?: boolean }) => {
    return (
        <fieldset className="form-section">
            <legend className="form-section-title">{legend_title}</legend>
            {toggle ? <ToggleTab>{children}</ToggleTab> : children}
        </fieldset>
    )
}

