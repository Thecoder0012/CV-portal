import React from 'react'
import axios from "axios";
import { useState } from "react";
import "../styles/registerPerson.css";

export const RegisterPerson = () => {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [addressId, setAddressId] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("http://localhost:8080/registerPerson", {
        firstname,
        lastname,
        dateOfBirth,
        phonenumber,
        addressId
      });
      res.data && window.location.replace("/");
    } catch (err) {
      setError(true);
    }
  };

    return (
        <div className="register">
          <span className="registerTitle">Enter Your User Information</span>
          <form className="registerForm" onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Enter your first name..."
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label>Last Name</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Enter your last name..."
              onChange={(e) => setLastname(e.target.value)}
            />
            <label>Date Of Birth</label>
            <input
              type="date"
              className="registerInput"
              placeholder="Enter your date of birth..."
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <label>Phonenumber</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Enter your phonenumber..."
              onChange={(e) => setPhonenumber(e.target.value)}
            />
            <label>Address</label>
            <input
              type="text"
              className="registerInput"
              placeholder="Enter your addressId..."
              onChange={(e) => setAddressId(e.target.value)}
            />
            
            <button className="registerButton" type="submit">
              Accept
            </button>
          </form>
        </div>
      );
}