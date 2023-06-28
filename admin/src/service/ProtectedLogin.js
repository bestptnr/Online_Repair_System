import React,{useEffect,useState} from 'react'
import { Navigate, Outlet } from "react-router-dom";
import LoginScreen from '../screens/LoginScreen';

const ProtectedLogin = ({ children }) => {
    let token = localStorage.getItem("token")
    console.log(token)
    let user = {}

    if(token){
        user = {islogged:true}
        

    }else{
        user = {islogged:false}

    }
    
  
    return (user.islogged ? <Navigate to='/home'/> :<LoginScreen/>)

}

export default ProtectedLogin