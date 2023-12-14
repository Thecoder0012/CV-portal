import styles from "../styles/auth.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavigationBar } from "./NavigationBar.js";
import axios from "axios";
import { API_URL } from "../api/url.js";

export const RegisterManager = () => {
  const [departments, setDepartments] = useState([]);
  const [chosenDepartment, setChosenDepartment] = useState("");

  const WITH_CREDENTIALS = { withCredentials: true };


  const handleDepartments = (event) => {
    setChosenDepartment(event.target.value);
    setProfile((prevProfile) => ({
      ...prevProfile,
      department_id: event.target.value,
    }));
  };

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    roleId: 1,
  });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    Phone: "",
    department_id: ""
  });
  const { username, email, password } = credentials;

  const { firstName, lastName, dateOfBirth, Phone,  department_id } = profile;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(API_URL + "/register", {
        username: username,
        email: email,
        password: password,
        role_id: 1,
      });
  
      const profileResponse = await axios.post(API_URL + "/manager", {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        Phone: Phone,
        department_id: department_id,
      }, WITH_CREDENTIALS);
  
      if (profileResponse.status === 200) {
        toast.success(profileResponse.data.message);
      }
  
      if (response.status === 500) {
        toast.error(profileResponse.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
  
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
    }
  };
  

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL + "/api/departments");
      if (response.status === 200) {
        setDepartments(response.data.departments);
      } else {
        console.error("Server could not find departments");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (event) => {
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));
  };

  const handleProfileChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={styles.mainContainer}>
      <NavigationBar />
      <div className={styles.registerContainer}>
        <div className={styles.register}>
          <span className={styles.registerTitle}>Register Manager</span>
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
            <select
              className={styles.registerInput}
              name="department_id"
              onChange={handleDepartments}
              value={chosenDepartment}
            >
              <option value="" disabled>
                Select a Department
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}, {department.country}
                </option>
              ))}
            </select>
            <div className={styles.personInfo}>
              <h2>Personal Info</h2>
              <label>First Name</label>
              <input
                onChange={handleProfileChange}
                value={firstName}
                name="firstName"
                placeholder="First Name"
              />
              <label>Last Name</label>
              <input
                onChange={handleProfileChange}
                value={lastName}
                name="lastName"
                placeholder="Last Name"
              />
              <label>Date of Birth</label>
              <input
                onChange={handleProfileChange}
                value={dateOfBirth}
                name="dateOfBirth"
                type="date"
              ></input>
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Phone"
                onChange={handleProfileChange}
                name="Phone"
                value={Phone}
              />
            </div>
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