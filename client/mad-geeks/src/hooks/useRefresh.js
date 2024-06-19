import axios  from '../api/axios';
import { useAuth } from '../hooks/useAuth';


/**
 * Custom Hook to refresh access token using the refresh token. 
 * Refresh should be called in a useEffect() 
 * @returns {function(): string} Async callback function that when invoked, returns the new access token. Returns NULL if refresh expired.
*/
export const useRefresh = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/refresh', { withCredentials: true })
            //if (response.data.status === 'OK') {
                console.log(response.data.access_token);
            setAuth((prev) => {
                return { ...prev, accessToken: response.data.access_token }
            });
            return response.data.access_token;
        } catch (error) { 
            console.log("Refresh token has expired.")
            //refresh token has expired! 
            setAuth((prev) => {
                return null;
            })
            return null;
        }

    }
    
    return refresh;
}