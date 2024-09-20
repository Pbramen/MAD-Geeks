import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";

import { MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";



export const GoogleMap = ({cameraProps, handleCameraChange} : {cameraProps: MapCameraProps, handleCameraChange: (ev: MapCameraChangedEvent) => void})  => {

    return (
        <APIProvider apiKey={process.env.REACT_APP_GCP_MAPS_KEY}>
            <Map
                reuseMaps={true}
                colorScheme="FOLLOW_SYSTEM"
                style={{ width: '100%', height: '100%' }}
                {...cameraProps}
                onCameraChanged={handleCameraChange}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    )
}