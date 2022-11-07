import { createContext, ReactNode } from "react";

interface UserProps {
    nome: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    login: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider( {children} : AuthProviderProps){

    async function login(){

    }

    return(
        <AuthContext.Provider value={
            {
                login,
                user: {
                    nome: ''
                }
            }
        }>
            {children}
        </AuthContext.Provider>
    );
}