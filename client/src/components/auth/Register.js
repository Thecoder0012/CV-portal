import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/auth/auth.module.css";
import { API_URL } from "../../config/apiUrl.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_id: "",
  });

  const { username, email, password, confirmPassword } = credentials;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
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
    <div className={styles.mainContainer}>
      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={3}
      />
      <div className={styles.registerContainer}>
        <div className={styles.register}>
          <span className={styles.registerTitle}>Create User</span>
          <form
            className={styles.registerForm}
            onSubmit={handleSubmit}
            method="POST"
          >
            <label>Username</label>
            <input
              type="text"
              name="username"
              className={styles.registerInput}
              placeholder="Username"
              value={username}
              onChange={handleInputChange}
              required
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              className={styles.registerInput}
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={styles.registerInput}
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={styles.registerInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleInputChange}
              required
            />
            <input
              className={styles.registerButton}
              type="submit"
              value="Register"
            />
          </form>

          <div className={styles.signupLink}>
            <p>
              <Link to="/login">Login in here if you have registered!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
