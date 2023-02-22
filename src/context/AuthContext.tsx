import React, { createContext, useReducer, useEffect } from "react";
import cafeApi from "../api/cafeApi";
import { LoginData, LoginResponse, Usuario } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducerr";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: () => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''

}

export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState)
    useEffect(() => {

        checkToken()

    }, [])

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token')
        //No token, no autenticado
        if (!token) return dispatch({ type: 'notAuthenticated' })
        //Hay token
    }


    const signUp = () => { };

    const signIn = async ({ correo, password }: LoginData) => {

        try {
            const resp = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario
                }
            })

            await AsyncStorage.setItem('token', resp.data.token)

        } catch (error: any) {
            console.log(error)
            dispatch({ type: 'addError', payload: error.response.data.msg })
        }


    };
    const logOut = () => { };
    const removeError = () => {

        dispatch({
            type: 'removeError'
        })
    }



    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

