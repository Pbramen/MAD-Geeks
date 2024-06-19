import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useRefresh } from "../hooks/useRefresh";
import { useAuth } from "../hooks/useAuth";

export function PerisitLogin(){
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefresh();
    const { auth } = useAuth();

    // run on mount only
    useEffect(() => {
        const verifyRefresh = async () => {
            try {
                const response = await refresh();

            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);

            }
        }
        
        !auth?.accessToken ? verifyRefresh() : setIsLoading(false);
    }, [])

    useEffect(() => {
        console.log(`isloading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading]);

    return (
        <>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet/>
            }
        </>
    )
}
