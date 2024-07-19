import { Dispatch, createContext, useState, ReactNode, SetStateAction } from "react";

export interface AuthState {    
    username: string,
    roles: number[],
    accessToken: string
}

export interface AuthDispatch {
    setAuth:  React.Dispatch<SetStateAction<AuthState>>;
}

export interface AuthContextType {
    auth: AuthState,
    setAuth: AuthDispatch['setAuth']
}

export const AuthContext = createContext < AuthContextType | {}>({ auth: {}, setAuth: {} });

