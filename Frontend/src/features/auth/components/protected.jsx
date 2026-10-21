import Loader from "../../common/components/Loader";
import {useAuth} from "../hooks/useAuth";
import Login from "../pages/Login";
import React from "react";
import { Navigate } from "react-router";

const Protected=({children})=>{
    
    const {user,loading}=useAuth();

    if(loading){
        return(<main><Loader/></main>)
    }

    if(!user){
        return <Navigate to={"/login"}/>;
    }
    return children
}
export default Protected
