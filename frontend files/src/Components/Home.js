import React, {useEffect, useState} from "react";
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

export default function Home(){
    
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const token = localStorage.getItem("token");

    useEffect( ()=> {
        getItems();
        isTokenExpiredfn();
    }, []);

    function getItems(){
        axios({
            method:'GET',
            url:'http://127.0.0.1:5000/getItems', 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            console.log(response.data);
            setItems(response.data);
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

    const deleteItem = (id) => {
        axios({
            method:'DELETE',
            url:`http://127.0.0.1:5000/deleteItem/${id}`, 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            console.log(response.data);
            getItems();
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
                        <p><Link to="/addItem" className="btn btn-success">Add New Item</Link></p>
                        <h1>Item List</h1>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item,key) =>
                                    <tr key={key}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <Link to={`updateItem/${item.id}`} className="btn btn-success" style={{marginRight: "10px"}}>Edit</Link>
                                            <button onClick={() => deleteItem(item.id)} className="btn btn-danger">Delete</button>
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