import { APIProvider, Map } from "@vis.gl/react-google-maps";

export const GoogleMap = ({location} : {location: GeolocationPosition | null})  => {
    const san_antonio_cordinates = { lat: 29.4252, lng: -98.4946 };
    var reformat_location = null
    if (location) {
        reformat_location = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
        }
    }

    return (
        <APIProvider apiKey={process.env.REACT_APP_GCP_MAPS_KEY}>
            <Map
                reuseMaps={true}
                colorScheme="FOLLOW_SYSTEM"
                style={{width: '100%', height: '100%'}}
                defaultCenter={reformat_location || san_antonio_cordinates}
                defaultZoom={10}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    )
}