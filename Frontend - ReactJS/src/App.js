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
import UserManagement from "./Components/UserManagement"
import UpdateUser from "./Components/UpdateUser" 

function App(){
  return (
    <div className='vh-100 gradient-custom'>
      <div className='container'>
      
      <div className='jumbotron'>
        <h5 className='page-header text-center'>Role Based User Authentication System with JWT Token using React-JS & Python-Flask</h5>
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
            <Route path="/userManagement" element={<UserManagement/>}></Route>
            <Route path="/userManagement/UpdateUser/:id" element={<UpdateUser/>}></Route>

          </Routes>
        </BrowserRouter>

      </div>
    </div>
  );
}

export default App;
