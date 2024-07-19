import { useAuth } from "./useAuth";
import { axiosPrivate } from "../api/axios";
import { useEffect } from 'react'
import { useRefresh } from "./useRefresh";
import { useNetworkChecker } from "./useNetworkChecker";
/**
 * Complete Mediation using axios interceptors for JWT. 
 * Handles auth State based on response. 
 * (verfiy auth middleware MUST be handled on the server when using this hook)
 * @return {import(axios).AxiosInstance} New private axios instance used for auth JWT 
 */
export function useAxiosP() {
    const { auth, setAuth } = useAuth();     // get auth state
    const refresh = useRefresh() 
    const networkChecker = useNetworkChecker();
    
    useEffect(() => {
        console.log("useAxiosP is mounted!")

        const res_axios = axiosPrivate.interceptors.response.use(
            response => {
                return response;
            },
            async (error) => {
                
                console.log('RESPONSE');
                const req = error?.config;
                // check if previous request, if not, then reject!
                if (error?.response.status === 403 && !req?.sent) {
                    const newToken = await refresh();
                    if (newToken === "AUTH_REQ") {
                        console.log("User must login again.")
                        // set auth here...
                        return Promise.reject(error);
                    }
                    req.headers['Authorization'] = `Bearer ${newToken}`
                    return axiosPrivate(req);
                }
                else {
                    console.log("uh-oh", error);
                    return Promise.reject(error);
                }


            }
        );

        // On subsequent requests (refresh token);
        const req_axios = axiosPrivate.interceptors.request.use(
            config => {
                console.log("REQUEST")
                // if request already exists....
                if (!config.headers["Authorization"]) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config;
            },
            (error) => {
                console.log("auth failed...")
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.response.eject(res_axios);
            axiosPrivate.interceptors.request.eject(req_axios);
        }
    }, [auth, refresh]);


    return axiosPrivate;
}