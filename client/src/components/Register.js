import React from "react";
import axios from "axios";
import { useState } from "react";
import "../styles/auth.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/register", {
        username: username,
        email: email,
        password: password,
        role_id: 2,
      });
    } catch (err) {
    }
  };

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
