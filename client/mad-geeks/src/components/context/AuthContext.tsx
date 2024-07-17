import { Dispatch, createContext, useState, ReactNode, SetStateAction } from "react";

export interface AuthState {    
    username: string,
    roles: number[],
    accessToken: string
}

export interface AuthDispatch {
    setAuth: React.Dispatch<AuthState>
}

export interface AuthContextType {
    auth: AuthState,
    setAuth: AuthDispatch
}

export const AuthContext = createContext<AuthContextType | {}>({});

