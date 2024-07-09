import React, {useEffect, useState} from "react";
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

export default function UserManagement(){
    
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect( ()=> {
        getUsers();
        isTokenExpiredfn();
    }, []);

    function getUsers(){
        axios({
            method:'GET',
            url:'http://127.0.0.1:5000/getUsers', 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            console.log(response.data);
            setUsers(response.data);
        })
        .catch((error) => {
            console.log(error.response.status)
            if(error.response.status==401 || error.response.status==422){
                navigate('/unauth')
            }
            if (error.response){
               console.error("ERROR:-> ", error)
            }
        });
    }

    const deleteUser = (id) => {
        axios({
            method:'DELETE',
            url:`http://127.0.0.1:5000/deleteUser/${id}`, 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            console.log(response.data);
            getUsers();
        })
        .catch((error) => {
            console.log(error.response.status)
            if(error.response.status==401 || error.response.status==422){
                navigate('/unauth')
            }
            if (error.response){
               console.error("ERROR:-> ", error)
            }
        });
        alert("Successfully Deleted.")
    }
    
    function logout(){
        axios({
            method:'POST',
            url:'http://127.0.0.1:5000/logout', 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            console.log("Logged out!")
            alert("Successfully Logged out!")
            navigate('/')
        })
        .catch((error) => {
            console.log(error.response.status)
            if(error.response.status==401 || error.response.status==422){
                navigate('/unauth')
            }
            if (error.response){
               console.error("ERROR:-> ", error)
            }
        });
    }

    function isTokenExpiredfn() {
        console.log("===> isTokenExpired called");
        const accessToken = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        axios.get('http://127.0.0.1:5000/validate_token', { headers })
        .then(response => {
            console.log(response.data)
            //alert(response.data.message);
        })
        .catch(err => {
            if(err.response.status===401 || err.response.status===422){
                console.log(err.response.data)
                alert(err.response.data.message);
                localStorage.removeItem('token')
                navigate('/unauth')
                if (err.response){
                    console.error("ERROR:-> ", err)
                }
            }
        });
    }
    
    
    return(
        <div>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-12">
                        <p><Link to="/userRegistration" className="btn btn-success">Add New User</Link></p>
                        <h1>User List</h1>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>About</th>
                                    <th>Role Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user,key) =>
                                    <tr key={key}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word', maxWidth:"300px"}}>{user.password}</td>
                                        <td>{user.about}</td>
                                        <td>{user.slug}</td>
                                        <td>
                                            <Link to={`updateUser/${user.id}`} className="btn btn-success" style={{marginRight: "10px"}}>Edit</Link>
                                            <button onClick={() => deleteUser(user.id)} className="btn btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <button type="submit" onClick={logout} name="logoutBtn" className='btn btn-danger'>Log out</button>
                    </div>
                </div>
            </div>
        </div>
    );

}