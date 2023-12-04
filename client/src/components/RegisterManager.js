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
    <div className={styles.mainContainer}>
    <NavigationBar/>

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
}