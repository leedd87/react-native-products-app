import React, { createContext, useReducer, useEffect } from "react";
import cafeApi from "../api/cafeApi";
import { LoginData, LoginResponse, Usuario, RegisterData } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from "./authReducerr";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
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
        const resp = await cafeApi.get('/auth')

        if (resp.data !== 200) {
            return dispatch({ type: 'notAuthenticated' })
        }
        await AsyncStorage.setItem('token', resp.data.token)
        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        })
    }


    const signUp = async ({ nombre, correo, password }: RegisterData) => {

        try {
            const resp = await cafeApi.post<LoginResponse>('/usuarios', { correo, password, nombre });
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
            dispatch({ type: 'addError', payload: error.response.data.errors[0].msg })
        }

    };

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
    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' })
    };
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

