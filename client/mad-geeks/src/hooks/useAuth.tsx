import { AuthContext, AuthContextType, AuthState } from "../components/context/AuthContext"
import { useContext, useEffect } from 'react';

export const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext) as AuthContextType;

    if (auth !== null || setAuth !== null) {

        return { auth, setAuth }
    }
    throw new Error("useAuth component out of scope.");
}