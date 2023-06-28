import React,{useEffect,useState} from 'react'
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    let token = localStorage.getItem("token")
    console.log(token)
    let user = {}

    if(token){
        user = {islogged:true}
        

    }else{
        user = {islogged:false}

    }
    
  
    return (user.islogged ? <Outlet/> :<Navigate to='/'/>)

}

export default ProtectedRoute