import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    SWAP_ALL_USER_SCREEN: "SWAP_ALL_USER_SCREEN",
    SWAP_SINGLE_USER_SCREEN: "SWAP_SINGLE_USER_SCREEN",
    SWAP_COMMUNITY_SCREEN: "SWAP_COMMUNITY_SCREEN",
    SWAP_HOME_SCREEN: "SWAP_HOME_SCREEN",
    SWAP_LOG_OUT_SCREEN: "SWAP_LOG_OUT_SCREEN"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        page: "home"
    });
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () =>{
        setOpen(true);
    }

    const handleClose = () =>{
        setOpen(false);
    }

    useEffect(() => {
        if(auth.loggedIn){
            auth.getLoggedIn();
        }
        
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.SWAP_ALL_USER_SCREEN:{
                return setAuth({
                    user: auth.user,
                    page: payload.page,
                    loggedIn : auth.loggedIn
                });
            }
            case AuthActionType.SWAP_SINGLE_USER_SCREEN:{
                return setAuth({
                    user: auth.user,
                    page: payload.page,
                    loggedIn : auth.loggedIn
                });
            }

            case AuthActionType.SWAP_COMMUNITY_SCREEN:{
                return setAuth({
                    user: auth.user,
                    page: payload.page,
                    loggedIn : auth.loggedIn
                });
            }

            case AuthActionType.SWAP_HOME_SCREEN:{
                return setAuth({
                    user: auth.user,
                    page: payload.page,
                    loggedIn : auth.loggedIn
                });
            }

            case AuthActionType.SWAP_LOG_OUT_SCREEN:{
                return setAuth({
                    user: auth.user,
                    page: payload.page,
                    loggedIn : auth.loggedIn
                });
            }

            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGIN_USER:{
                return setAuth({
                    user:payload.user,
                    loggedIn: true,
                    page: payload.page
                })
            }
            case AuthActionType.LOGOUT_USER:{
                return setAuth({
                    user:{},
                    loggedIn: false,
                    page: payload.page
                })
            }

            default:
                return auth;
        }
    }

    auth.swapAllUserScreen = function (){
        authReducer({
            type: AuthActionType.SWAP_ALL_USER_SCREEN,
            payload:{
                page: "all user"
            }
        })
    }

    auth.swapSingleUserScreen = function (){
        authReducer({
            type: AuthActionType.SWAP_SINGLE_USER_SCREEN,
            payload:{
                page: "single user"
            }
        })
    }

    auth.swapCommunityScreen = function (){
        authReducer({
            type: AuthActionType.SWAP_COMMUNITY_SCREEN,
            payload:{
                page: "community"
            }
        })
    }

    auth.swapHomeScreen = async function (){
        authReducer({
            type: AuthActionType.SWAP_HOME_SCREEN,
            payload:{
                page: "home"
            }
        })
    }


    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userData, store) {
        console.log(userData)
        var response = null
        response = await api.registerUser(userData);
        console.log(response.data.user); 
        if (response.status === 200) {
            auth.swapHomeScreen();
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }else{
            setMessage(response.data.errorMessage);
            handleOpen();
        }
    }

    auth.logInUser = async function(userData, store) {
        const response = await api.loginUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                }
            })
            history.push("/");
            auth.page = 'home';
            store.loadIdNamePairs();
        }else{
            setMessage(response.data.errorMessage);
            handleOpen();
        }
    }

    auth.logoutUser = function(){
        authReducer({
            type:AuthActionType.LOGOUT_USER,
            payload:{
                page: "log out"
            }
        })
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
            <Dialog
                open ={open}
                onClose={handleClose}
                maxWidth = 'sm'
                id = "sign-in-model"
                >
                <DialogTitle>
                    {message}
                    <DialogActions>
                        <Button onClick = {handleClose}>Close</Button>
                    </DialogActions>
                </DialogTitle>
            </Dialog>
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };