import styles from "../styles/ManagerForm.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_URL } from "../api/url.js";

export const RegisterManager = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = credentials;

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

  const handleInputChange = (event) => {
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={styles.body}>
      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={3}
      />
      <div id={styles.header}>
        <h1>Register Manager</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.container} method="POST">
        <p>
          <input
            id="Username"
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </p>

        <p>
          <input
            id="Email"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </p>
        <p>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </p>
        <input type="submit" id={styles.submitButton} value="Sign up" />
      </form>

      <div id={styles.loginLink}>
        <p>
          <Link to="/">Click here to login if you have registered!</Link>
        </p>
      </div>
    </div>
  );
};
