import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from 'react';

// custom hooks
import { useRefresh } from "../hooks/useRefresh";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// send a request to the server via axios to get a refresh token
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
                // token has expired/invalid or no token found.
                else if (res === "AUTH_REQ") {
                    nav('/login');
                }
            }).catch(e => 
                console.error("Error when refreshing..", e)
            ).finally(() => {
                setIsLoading(false);
            })
        }
        
        // if access token is NOT already set -> send request to server. 
        
        !auth?.accessToken ? verifyRefresh() : setIsLoading(false);
    }, [])

    // TODO: add a loading page?
    return (
        <React.Fragment>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet/>
            }
        </React.Fragment>
    )
}
