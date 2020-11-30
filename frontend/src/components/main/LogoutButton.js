import React, {useEffect} from "react"
import store from "../../storage/storage";
import {Button} from "primereact/button";


const logoutHandle=()=>{
    store.dispatch({type: "TOKEN_CLEAR", token: null})

}

function LogoutButton() {


    return (
        <div className="p-align-center p-fluid">
                <div className="p-sm-12 p-md-6 p-xl-3">
                    <Button type="button" onClick={logoutHandle} className="p-button-primary p-margin" label="Logout"/>
                </div>
        </div>
    );
}
export default LogoutButton