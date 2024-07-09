import React, { useState, useEffect  } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
 
export default function UpdateItem(){

    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const {id} = useParams();
    const token = localStorage.getItem("token");

    useEffect( ()=> {    
        getItem();
        isTokenExpiredfn();
    }, []);
  
    function getItem() {
        axios({
            method:'GET',
            url:`http://127.0.0.1:5000/getItem/${id}`, 
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function(response){
            console.log(response.data);
            setInputs(response.data);
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
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios({
            method:'PUT',
            url:`http://127.0.0.1:5000/updateItem/${id}`, 
            headers: {
                "Authorization" : `Bearer ${token}`
            },
            data:inputs
        })
        .then(function(response){
            console.log(response.data);
            navigate(-1);
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
    };

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
    

    return (
    <div>
        <div className="container h-100">
        <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" value={inputs.name} className="form-control" name="name" onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label>Price</label>
                  <input type="text" value={inputs.price} className="form-control" name="price" onChange={handleChange} />
                </div>   
                <button type="submit" name="update" className="btn btn-primary">Save</button>
            </form> 
            </div>
            <div className="col-2"></div>
        </div>
        </div>
    </div>
  );
}