import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../config/apiUrl.js";
import logo from "../images/logo.png"
import Navbar from "../styles/navBar.module.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown} from  "@fortawesome/free-solid-svg-icons"


export const NavigationBar = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [auth, setAuth] = useState()
    const WITH_CREDENTIALS = { withCredentials: true };

    async function authName() {
        const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);
    setAuth(response.data.user.username)
    }

    authName()

    async function handleSignOut(){
       const response = await axios.get(API_URL + "/logout", WITH_CREDENTIALS)

       if(response.status === 200){
        toast.success(response.data.message)
       }
    }



return (
    <div>
        <ToastContainer
            autoClose={3000}
            closeOnClick={true}
            position={toast.POSITION.TOP_CENTER}
            limit={1}
        />
        <nav className={Navbar.navContainer}>
        <h4>User: {auth} </h4>
            <div className={Navbar.logoContainer}>
                <img className={Navbar.logo} src={logo} alt="Logo" />
            </div>
            <div className={Navbar.iconWrapper}>
                <li className={Navbar.dropdown}>
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        className={Navbar.dropbtnArrow}
                        style={{ color: '#A100FF' }}
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                    />
                    {dropdownVisible && (
                        <div className={Navbar.dropdownContent}>
                            <Link to="/login" onClick={handleSignOut}>Sign out</Link>
                            <Link to="/profile">Update profile</Link>
                        </div>
                    )}
                </li>
            </div>
        </nav>
    </div>
);


}
