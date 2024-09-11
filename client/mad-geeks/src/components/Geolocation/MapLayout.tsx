import { useGeoLocationPermissions } from "./hooks/useGeoLocationPermissions"
import React, { useState } from 'react';

import { GoogleMap } from "./GoogleMap";
import { ErrorMessage } from "components/SmallErrorMessage";

export const MapLayout = () => { 
    const { cords, error, handlePermissions, resetError } = useGeoLocationPermissions();

    return (
        <div>
            
            {error && <ErrorMessage message='Permission denied' onClick={resetError} />}
            <h2>Explore nearby table-top stores!</h2>
            <button id="use-location" type="button" onClick={handlePermissions} className="btn-1">Use my Location</button>
            <div className="display-map">
                <GoogleMap location={cords} />
            </div>
        </div>
    )

}