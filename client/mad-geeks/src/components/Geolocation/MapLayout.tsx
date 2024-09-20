import { useGeoLocationPermissions } from "./hooks/useGeoLocationPermissions"
import React, { useState } from 'react';


import { GoogleMap } from "./GoogleMap";
import { ErrorMessage } from "components/SmallErrorMessage";


export const MapLayout = () => { 
    const { cameraProps, error, handlePermissions, handleCameraChange, resetError, loading } = useGeoLocationPermissions();

    return (
        <div>
            
            {error && <ErrorMessage message='Permission denied' onClick={resetError} />}
            <h2>Explore nearby table-top stores!</h2>

            <button id="use-location" type="button" onClick={handlePermissions} className="btn-1">Use my Location</button>
            {loading && <div>Loading ...</div>}
            <div className="display-map">
                <GoogleMap cameraProps={cameraProps} handleCameraChange={handleCameraChange}/>
            </div>
        </div>
    )

}