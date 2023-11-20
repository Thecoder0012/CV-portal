import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import { useNavigate, Link } from "react-router-dom";
import { Register } from "./Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        navigate("/cv");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mainContainer">
      <div className="login-container">
        <div className="login">
          <span className="loginTitle">Login</span>
          <form className="loginForm" onSubmit={handleSubmit}>
            <input
              type="text"
              className="loginInput"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginButton" type="submit">
              Login
            </button>
          </form>
          <div className="signup-link">
            <Link to="/register">Click here to Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
