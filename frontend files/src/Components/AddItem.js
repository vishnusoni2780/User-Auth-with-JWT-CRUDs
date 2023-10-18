import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItem(){
    
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const token = localStorage.getItem('token');
    
    const handleChange = (event) => {
        const name = event.target.name;                     // Name of filed which will be edited
        const value = event.target.value;                   // value will be changed as per input
        setInputs(values => ({...values, [name]: value}));  // ...values Spread Operator    
        //console.log(name, value);                         // Name of field + Value entered
    }
    
    const handleSubmit = (event) => {
        //console.log(inputs);
        event.preventDefault();
        
        axios({
            method: "POST",
            url:'http://127.0.0.1:5000/addItem', 
            headers: {
              Authorization: `Bearer ${token}`
            },
            data:{
                name: inputs.name,
                price: inputs.price
            }
          }).then(function(response){
            console.log(response.data);
            navigate(-1);
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
    
    useEffect(() => {
        isTokenExpiredfn()
    }, []);
    
    return (
    <div>
        <div className="container h-100">
            <div className="row">
                <div className="col-2"></div>
                <div className="col-8">
                    <h1>Create Item</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Name</label>
                            <input type="text" className="form-control" name="name" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label>Price</label>
                            <input type="text" className="form-control" name="price" onChange={handleChange} />
                        </div>
                        <button type="submit" name="add" className="btn btn-primary">Save</button>
                    </form>

                </div>
            </div>
        </div>
    </div>
    );
}