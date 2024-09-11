import { useState } from "react";

export function useGeoLocationPermissions() {
    const [cords, setCords] = useState<GeolocationPosition>(null)
    const [error, setError] = useState<GeolocationPositionError>(null);

    const onSuccess = (pos: GeolocationPosition) => {
        console.log(pos);
        setCords(pos)
    
    };

    const onFailure = (error: GeolocationPositionError) => {
        console.log(error);
        setCords(null);
        setError(error);
    }

    const resetError = (e: React.MouseEvent) => {
        setError(null);
    }

    const handlePermissions = () => {
        navigator.permissions.query({ name: 'geolocation' })
            .then((result) => {
                const state = result.state;
                console.log(state);
                switch (state) {
                    case 'granted':
                        document.getElementById('use-location').style.display = 'none';
                        break;
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
            })
    }

    return {
        cords, error, handlePermissions, resetError
    }
}

