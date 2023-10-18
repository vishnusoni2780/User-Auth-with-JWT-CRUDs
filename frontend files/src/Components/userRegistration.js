import React, { useState  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserRegistration(props){

    
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    
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
            method:"POST",
            url:"http://127.0.0.1:5000/signup",
            data:{
                name: inputs.name,
                email: inputs.email,
                about: inputs.about,
                password: inputs.password
            }
        })
        .then((response) => {
            console.log(response)
            if(response){
                alert("User Registered Successfully.")
                navigate('/')
            }
            else{alert("Something went wrong.")}
        })
        .catch((error) => {
            if (error.response){
                console.error("ERROR:-> ", error)
                alert(error.response.data.error)
            }
        })
        .then((response) => {
            console.log(response)
        });
    }

    return (
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <br></br>
                        <h3 className='text-center'>New User Registration</h3>
    
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>User Name</label>
                                <input type="text" className="form-control" name="name" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" name="email" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>About Me</label>
                                <input type="text" className="form-control" name="about" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control" name="password" onChange={handleChange} />
                            </div>
                            <button type="submit" name="register" className="btn btn-primary">Register Me!</button>
                        </form>
    
                    </div>
                </div>
            </div>
        </div>
        );
}