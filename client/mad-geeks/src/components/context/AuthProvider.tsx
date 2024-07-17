import React, { useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [auth, setAuth] = useState({});
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
} 
