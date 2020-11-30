import React, {useState} from "react";
import './loginForm.css';
import store from "../../storage/storage";
import {Messages} from "primereact/messages";
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button";
import {Password} from 'primereact/password';
import "../../index.css"


let MessagesInstance
function LoginForm() {

    const onSignIn=(e)=>{
        const data ={
            "username":username,
            "password":password
        }

        fetch("/api/auth/login", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => response.json().then(json => {
            if (response.ok) {
                store.dispatch({type: "NEW_TOKEN", token: json.token, rtoken:json.refresh_token})
            } else if (response.status === 403) {
                MessagesInstance.show({
                    severity: 'error',
                    summary: json.description
                })
            } else {
                MessagesInstance.show({
                    severity: 'error',
                    summary: 'Unhandled error'
                })
            }
        }))
    }

    const onSignUp=(e)=>{
        const data ={
            "username":username,
            "password":password
        }

        fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => response.json().then(json => {
            if (response.ok) {
                store.dispatch({type: "NEW_TOKEN", token: json.token, rtoken:json.refresh_token})
            } else if (response.status === 403) {
                MessagesInstance.show({
                    severity: 'error',
                    summary: json.description
                })
            } else {
                MessagesInstance.show({
                    severity: 'error',
                    summary: 'Unhandled error'
                })
            }
        }))
    }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="p-align-center p-fluid">
            <form className="form_div">
                <Messages icon ref={(el) => MessagesInstance = el}/>
                <div className="p-field p-grid"     >

                    <div className="p-field p-grid">
                        <label htmlFor="username" className="p-sm-2 p-md-4 p-xl-6">Username</label>
                        <div className="p-sm-12 p-md-7 p-xl-5">
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    </div>
                    <div className="p-field p-grid ">
                        <label htmlFor="password" className="p-sm-2 p-md-4 p-xl-6">Password</label>
                        <div className="p-sm-12 p-md-7 p-xl-5 ">
                            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="p-sm-12 p-md-6  p-align-center">
                        <Button type="button" onClick={onSignIn} className="p-button-primary p-margin" label="Sign in" icon="pi"/>
                    </div>

                    <div className="p-sm-12 p-md-6 p-xl-3 p-align-center" >
                        <Button type="button" onClick={onSignUp} className="p-button-primary " label="Register" icon="pi"/>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default LoginForm;