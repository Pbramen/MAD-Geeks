import axios from '../api/axios';
import {AxiosError} from 'axios';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"

export const useNetworkChecker = ({e}) => {
    const nav = useNavigate();
    useEffect(() => {
        const handleAxiosError = (e: AxiosError) => {
            if (e?.code === 'ERR_NETWORK') {
                // TODO : add specific server is down page!
                console.log("uwuw");
                //nav("/login");
            }
            else
                return e;
        }   

        const res_axios = axios.interceptors.response.use(res => res, handleAxiosError );
        const req_axios = axios.interceptors.request.use(req => req, handleAxiosError);
        
        return (
            axios.interceptors.response.eject(res_axios),
            axios.interceptors.request.eject(req_axios)
        )
    }, [])
     
    return axios;
}

