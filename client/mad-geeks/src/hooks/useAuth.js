import { AuthContext } from "../components/context/AuthContext"
import { useContext } from 'react';

export const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);

    if (auth !== null || setAuth !== null) {
        return {auth, setAuth}
    }
    throw new Error("useAuth component out of scope.");
}