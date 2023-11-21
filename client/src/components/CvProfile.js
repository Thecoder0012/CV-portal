import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";
import { API_URL } from "../config/apiUrl.js";
import { useNavigate } from "react-router-dom";

export const CvProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    address_id: "",
  });

  const { first_name, last_name, date_of_birth, phone_number, address_id } =
    profile;

  const [auth, setAuth] = useState();
  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const checkAuth = (response) => {
    return response.data.auth
      ? setAuth(response.data.user.username)
      : navigate("/login");
  };

  useEffect(() => {
    async function getData() {
      const response = await axios.get(API_URL + "/login", WITH_CREDENTIALS);
      checkAuth(response);
    }
    getData();
  }, []);

  const handleInputChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + "/profile", {
        first_name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth,
        phone_number: phone_number,
        address_id: address_id,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="mainContainer">
      <h3 style={{ textAlign: "right" }}>Logged in as: {auth}</h3>
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={2}
      />
      <div className="cv-container">
        <div className="register">
          <span className="registerTitle">Enter Your User Information</span>
          <form className="registerForm" onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              className="registerInput"
              name="first_name"
              placeholder="Enter your first name..."
              onChange={handleInputChange}
            />
            <label>Last Name</label>
            <input
              type="text"
              className="registerInput"
              name="last_name"
              placeholder="Enter your last name..."
              onChange={handleInputChange}
            />
            <label>Date Of Birth</label>
            <input
              type="date"
              className="registerInput"
              name="date_of_birth"
              placeholder="Enter your date of birth..."
              onChange={handleInputChange}
            />
            <label>Phonenumber</label>
            <input
              type="text"
              className="registerInput"
              name="phone_number"
              placeholder="Enter your phonenumber..."
              onChange={handleInputChange}
            />
            <label>Address</label>
            <input
              type="text"
              className="registerInput"
              name="address_id"
              placeholder="Enter your addressId..."
              onChange={handleInputChange}
            />

            <input className="registerButton" type="submit" value="Create" />
          </form>
        </div>
      </div>
    </div>
  );
};
