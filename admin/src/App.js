import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link ,Outlet } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProtectedRoute from "./service/ProtectedRoute";
import ProtectedLogin from "./service/ProtectedLogin";
import Navbar from "./components/NavBar";
import RequestScreen from "./screens/RequestScreen";
import React, { useState, useEffect } from "react";
import ProcessScrenn from "./screens/ProcessScrenn";
import SuccessScrenn from "./screens/SuccessScrenn";
function App() {

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<ProtectedLogin />} exact />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomeScreen />} exact />
          <Route path="/request" element={<RequestScreen />} exact />
          <Route path="/process" element={<ProcessScrenn/>} />
          <Route path="/success" element={<SuccessScrenn/>} />
        </Route>
        <Route path="/test" element={<HomeScreen />} exact />

      </Routes>

    </Router>
  );
}

export default App;
