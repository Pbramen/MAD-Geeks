import axios  from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useCallback } from 'react';

/**
 * Custom Hook to refresh access token using the refresh token. 
 * Refresh should be called in a useEffect() 
 * @returns {function()} Async callback function that when invoked, returns the new access token. Returns NULL if refresh expired.
*/
export const useRefresh = () => {
    const { auth, setAuth } = useAuth();
    // cache results... 
    const refresh = useCallback(async () => {
        try {
            const response = await axios.get('/api/clients/refresh', { withCredentials: true })
            //if (response.data.status === 'OK') {
            console.log('setting new auth:', response.data.access_token);
            setAuth((prev) => {
                return { username: response.data.username, roles: response.data.roles, accessToken: response.data.access_token }
            });
            return response.data.access_token;
        } catch (error) {
            // if server was down...
            console.log("Refresh token has expired or invalid.")
            if (error?.code == "ERR_NETWORK") {
                return error.code;
            }
            //refresh token has expired! 
            setAuth((prev) => {
                return null;
            })
            return "AUTH_REQ";
        }
    }, []);
    
    return refresh;
}