import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/apiUrl.js";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { username, password } = credentials;
  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        API_URL + "/login",
        {
          username: username,
          password: password,
        },
        WITH_CREDENTIALS
      );

      if (response.status === 200) {
        navigate("/cv");
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
      <div className="login-container">
        <div className="login">
          <span className="loginTitle">Login</span>
          <form className="loginForm" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              className="loginInput"
              name="username"
              placeholder="Username"
              onChange={handleInputChange}
            />
            <label>Password</label>
            <input
              type="password"
              className="loginInput"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <input className="loginButton" type="submit" value="login" />
          </form>
          <div className="signup-link">
            <Link to="/register">Click here to Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
