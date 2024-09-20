import { useState, useRef } from "react";

import { MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";

const san_antonio_cordinates = { lat: 29.4252, lng: -98.4946 };
const INIT_CAMERA = {
    center: san_antonio_cordinates,
    zoom: 12
}

// custom hook to ask for user for obtaining their current location
export function useGeoLocationPermissions() {
    const [error, setError] = useState<GeolocationPositionError>(null);
    const [cameraProps, setCameraProps] = useState<MapCameraProps>(INIT_CAMERA);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCameraChange = (ev: MapCameraChangedEvent) => {
        setCameraProps(prev => ev.detail);
    }

    const onSuccess = (pos: GeolocationPosition) => {
        const state: google.maps.LatLngLiteral = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }
        setCameraProps((prev) => {
            return {...prev, center: state}
        })
        setLoading(false);
    };

    const onFailure = (error: GeolocationPositionError) => {
        console.log(error);
        setError(error);
        setLoading(false);
    }

    const resetError = (e: React.MouseEvent) => {
        console.log("oh")
        setError(null);
    }

    const handlePermissions = () => {
        setLoading(()=>true);
        console.log(loading);
        navigator.permissions.query({ name: 'geolocation' })
            .then((result) => {
                const state = result.state;
                switch (state) {
                    case 'granted':
                    case 'prompt':
                        navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
                        break;
                    case 'denied':
                        console.log('Permission denied. Unable to retrieve location.');
                        break;
                    default:
                        console.log('No action taken for geolocation');
                }
            }).catch(error => {
                console.error(error);
            });
    }

    return {
        cameraProps, error, handlePermissions, resetError, handleCameraChange, loading
    }
}

