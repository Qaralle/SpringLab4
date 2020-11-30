import {createStore} from 'redux';
import React from "react";


function reducer(state, action) {
    switch (action.type) {
        case "TOKEN_CLEAR":
            sessionStorage.clear()
            return {
                token:action.token
            }

        case "TOKEN_UPDATE":
            sessionStorage.setItem("access_token", action.rtoken)
            return {
                token:action.token
            }

        case "NEW_TOKEN":
            sessionStorage.setItem("access_token", action.token)
            sessionStorage.setItem("refresh_token", action.rtoken)
            return {
                token:action.token
            }
        default:
            return state

    }

}

const store =createStore(reducer,{
    token:sessionStorage.getItem("access_token")
})

store.subscribe(()=>console.log(store.getState()))

export default store