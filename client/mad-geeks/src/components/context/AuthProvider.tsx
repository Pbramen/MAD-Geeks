import React, { useState, ReactNode } from "react";
import { AuthContext, AuthState } from "./AuthContext";

export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [auth, setAuth] = useState<AuthState | {}>({});
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
} 
