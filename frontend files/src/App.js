import React, { } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import "./App.css";
import Login from './Components/Login';
import UserRegistration from "./Components/userRegistration";
import Home from "./Components/Home"
import AddItem from "./Components/AddItem"
import UpdateItem from "./Components/UpdateItem"
import Profile from "./Components/Profile"
import UnAuth from "./Components/unauth"

function App(){
  return (
    <div className='vh-100 gradient-custom'>
      <div className='container'>
      
      <div className='jumbotron'>
        <h5 className='page-header text-center'>User Authentication System with JWT Token using React-JS and Python Flask</h5>
      </div>
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/userRegistration" element={<UserRegistration/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/addItem" element={<AddItem/>}></Route>
            <Route path="/home/updateItem/:id" element={<UpdateItem/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route path="/unauth" element={<UnAuth/>}></Route>

          </Routes>
        </BrowserRouter>

      </div>
    </div>
  );
}

export default App;
