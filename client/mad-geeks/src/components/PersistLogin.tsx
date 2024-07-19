import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useRefresh } from "../hooks/useRefresh";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function PerisitLogin(){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const refresh = useRefresh();
    const { auth } = useAuth();
    const nav = useNavigate();
    
    useEffect(() => {
        console.log("persist is running...") 
        // eslint-disable-next-line
        const verifyRefresh = async () => {
            
            refresh().then(res => {
                if (res === 'ERR_NETWORK') {
                    //TODO: add a server down page!
                    console.log("uhoh server down!");
                    nav("/login")
                }
                else if (res === "AUTH_REQ") {
                    nav('/register');
                }
            }).catch ( e => 
                console.error(e)
            ).finally(() => {
                setIsLoading(false);
            })
        }
        
        // if access token is not set -> send request to server. 
        !auth?.accessToken ? verifyRefresh() : setIsLoading(false);
    }, [])

    console.log(isLoading);
    return (
        <React.Fragment>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet/>
            }
        </React.Fragment>
    )
}
