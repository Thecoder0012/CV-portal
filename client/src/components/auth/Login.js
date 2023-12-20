import React, { useEffect, useState } from "react";
import styles from "../../styles/auth/auth.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../config/apiUrl.js";

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
        navigate("/main");
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
    <div className={styles.body}>
      <div className={styles.mainContainer}>
        <ToastContainer
          autoClose={15000}
          closeOnClick={true}
          position={toast.POSITION.TOP_CENTER}
          limit={2}
        />
        <div className={styles.loginContainer}>
          <div className={styles.login}>
            <span className={styles.loginTitle}>Login</span>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles.loginInput}
                name="username"
                placeholder="Username"
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                className="loginInput"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                required
              />
              <input
                className={styles.loginButton}
                type="submit"
                value="Login"
              />
            </form>
            <div className={styles.signupLink}>
              <Link to="/register">Click here to Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
