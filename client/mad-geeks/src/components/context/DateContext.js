import { createContext } from 'react';

export const DateContext = createContext({});

export function DateContextProvider({ children, data, setData}) {
    return (
        <DateContext.Provider value={ [data, setData]}>
            {children}
        </DateContext.Provider>
    )
}