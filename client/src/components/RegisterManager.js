import styles from "../styles/auth.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavigationBar } from "./NavigationBar.js";
import axios from "axios";
import { API_URL } from "../api/url.js";

export const RegisterManager = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = credentials;

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
  });

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + "/register", {
        username: username,
        email: email,
        password: password,
        roleId: 1,
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

  const handleInputChangeCred = (event) => {
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));
  };

  const handleInputChangeProfile = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={styles.mainContainer}>
      <NavigationBar />

      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={3}
      />

      <div className={styles.registerContainer}>
        <div className={styles.register}>
          <span className={styles.registerTitle}>Create Manager</span>
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
              onChange={handleInputChangeCred}
              required
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              className={styles.registerInput}
              placeholder="Email"
              value={email}
              onChange={handleInputChangeCred}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={styles.registerInput}
              placeholder="Password"
              value={password}
              onChange={handleInputChangeCred}
              required
            />
            <label>First Name</label>
            <input
              type="text"
              className="registerInput"
              placeholder="First Name"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChangeProfile}
            />
            <label>Last Name</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Last Name"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChangeProfile}
            />
            <label>Date Of Birth</label>
            <input
              type="date"
              className=""
              name="date_of_birth"
              value={formatDate(profile.date_of_birth)}
              onChange={handleInputChangeProfile}
            />
            <label>Phone</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Phone Number"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleInputChangeProfile}
            />
            <input
              className={styles.registerButton}
              type="submit"
              value="Register"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
