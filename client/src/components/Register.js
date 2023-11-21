import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { API_URL } from "../config/apiUrl.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
  });

  const { username, email, password } = credentials;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + "/register", {
        username: username,
        email: email,
        password: password,
        role_id: 2,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
    }
  };

  const handleInputChange = (event) => {
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="mainContainer">
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={2}
      />
      <div className="register-container">
        <div className="register">
          <span className="registerTitle">Create User</span>
          <form className="registerForm" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="registerInput"
              placeholder="Username"
              onChange={handleInputChange}
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              className="registerInput"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="registerInput"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <input className="registerButton" type="submit" value="Register" />
          </form>

          <div className="signup-link">
            <p>
              <Link to="/login">Sign in here if you have registered!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
