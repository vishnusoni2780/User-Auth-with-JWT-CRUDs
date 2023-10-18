import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(props){

    let isTokenExpired = null;
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email:"",
        password:""
    });
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
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            url:"http://127.0.0.1:5000/create_token",
            data:{
                email: inputs.email,
                password: inputs.password
            }
        })
        .then((response) => {
            console.log("Access Token: ",response.data.access_token)
            localStorage.setItem('token',response.data.access_token)
            //localStorage.setItem('email',response.data.email)
            navigate('/profile') 
        })
        .catch((error) => {
            if (error.response){
                console.error("ERROR:-> ", error)
                alert(error.response.data.error)
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
            isTokenExpired = false;
        })
        .catch(err => {
            if(err.response.status===401 || err.response.status===422){
                console.log(err.response.data)
                alert(err.response.data.message);
                localStorage.removeItem('token')
                navigate('/')
                if (err.response){
                    console.error("ERROR:-> ", err)
                }
                isTokenExpired = true;
            }
        });
    }
    
    useEffect(() => {
        if(token){
            isTokenExpiredfn()
        }
    }, []);
    
    const loginWithGoogle = async () => {
        try {
            const { data } = await axios({
                method:"GET",
                url:"http://127.0.0.1:5000/google-login"
            });
            console.log("Data: ",data)
            const googleAuthWindow=window.open(data.redirect_uri, '_blank', 'width=600,height=400');

            if(googleAuthWindow){
                googleAuthWindow.focus();
            }

        } catch (error) {
            console.error("Google login error:", error);
        }
    };


    return (
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <h3 className='text-center'>Login Page</h3>

                        {(!isTokenExpired && token)
                        ? ( "you are Logged in with Access Token: " + token)
                        : (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" value={inputs.email} className="form-control" name="email" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" value={inputs.password} className="form-control" name="password" onChange={handleChange} />
                                </div>
                                <div className="row" style={{marginLeft:220}}>
                                    <div className="col-md-6" style={{alignItems:'center', display: 'flex',  justifyContent:'center'}}>
                                        <button type="submit" name="loginBtn" className="btn btn-primary" style={{width:250}}>Login Me</button>
                                    </div>
                                </div>
                            </form>

                            
                            <div className="text-center">
                                <hr className="hr hr-blurry"/>
                                <label>------------------Or------------------</label>
                                <hr className="hr hr-blurry" />
                            </div>
                            
                            <div className="row" style={{marginLeft:80}}>
                                <div className="col-md-6" style={{alignItems:'center', display: 'flex',  justifyContent:'center'}}>
                                    <button onClick={loginWithGoogle} className="btn btn-outline-dark" href="#" role="button" style={{textTransform:"none"}}>
                                        <img width="20px" style={{marginBottom:3, marginRight:5}} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                        Login with Google
                                    </button>
                                </div>
                                <div className="col-md-6" >
                                    <a className="btn btn-outline-dark" href="#" role="button" style={{textTransform:"none"}}>
                                        <img width="20px" style={{marginBottom:3,marginRight:5}} alt="Azure sign-in" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" />
                                        Login with Azure
                                    </a>
                                </div>
                            </div>

                            <div className="text-center">
                                <hr className="hr hr-blurry"/>
                            </div>

                            <div className="mb-3 my-3" style={{marginLeft:180}}>
                                <label>New Registration? <a href="/userRegistration">Click Here to Register yourself!</a></label>
                            </div>
                        </>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
        );
}