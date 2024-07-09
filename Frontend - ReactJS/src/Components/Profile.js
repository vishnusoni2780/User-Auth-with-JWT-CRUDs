import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
function Profile() {
 
    const [profileData, setProfileData] = useState(null)
     
    useEffect(() => {
        getProfileDetails();
        isTokenExpiredfn();
    }, []);
    
    const navigate = useNavigate();
    //const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
     
    function getProfileDetails() { 
        axios({
          method: "GET",
          url:'http://127.0.0.1:5000/profile', 
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
            console.log(response)

          setProfileData(({
            pid: response.data.id,
            profile_name: response.data.name,
            profile_email: response.data.email,
            about_me: response.data.about}))
        })
        .catch((error) => {
            console.log(error.response)
            if(error.response.status===401 || error.response.status===422){
                navigate('/unauth')
            }
            if (error.response){
               console.error("ERROR:-> ", error)
            }
        });
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
            //localStorage.removeItem('email');
            console.log("Logged out!")
            alert("Successfully Logged out!")
            navigate('/')
        })
        .catch((error) => {
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
    


    let imgs = [
      'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp',
    ];
 
 
  return (
    
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/profile">Profile</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="nav-item nav-link" href="/addItem">Add Item</a>
                    <a className="nav-item nav-link" href="/home">View Items</a>
                </div>
            </div>
            <button type="submit" onClick={logout} name="logoutBtn" className='btn btn-danger'>Log out</button>
        </nav>

        <div className="row d-flex justify-content-center align-items-center h-50">
          <div className="col col-lg-12">
                <div className="card mb-3">
                {
                    profileData &&
                    <div className="row g-0">
                        <div className="col-md-4 bg-c-lite-green text-center text-white">
                            <img src={imgs[0]} alt="#" className="img-fluid my-5" width="150"/>
                            <i className="far fa-edit mb-5"></i>
                        </div>
                
                        <div className="col-md-8">
                            <div className="card-body p-4">
                                <h4>Your profile details:</h4>
                                
                                <div className="row pt-1">
                                    <div className="col-6 mb-3">
                                        <h6>ID: </h6>
                                        <p className="text-muted">{profileData.pid}</p>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <h6>Name</h6>
                                        <p className="text-muted">{profileData.profile_name}</p>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <h6>Email</h6>
                                        <p className="text-muted">{profileData.profile_email}</p>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <h6>About</h6>
                                        <p className="text-muted">{profileData.about_me}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    </div>
    );
}
 
export default Profile;