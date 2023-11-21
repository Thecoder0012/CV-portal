import React from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/auth.css";
import { API_URL } from "../config/apiUrl.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(response.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
  }
}

  return (
    <div className="mainContainer">
      <div className="register-container">
        <div className="register">
          <span className="registerTitle">Create User</span>
          <form className="registerForm" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Email</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              className="registerInput"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="registerButton" type="submit">
              Create user
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  }  
