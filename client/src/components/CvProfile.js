import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/auth.module.css";
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

    const [addresses, setAddresses] = useState([]);
    const [chosenAddress, setChosenAddress] = useState("");
    const [number_taken, set_number_taken] = useState(false);

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
   async function getData() {
     const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);
     checkAuth(response);
   }

  useEffect(() => {
    getData();
    fetchAddresses();
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
      },WITH_CREDENTIALS);

      if (response.status === 200) {
        set_number_taken(false)
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      set_number_taken(false)

     if(err.response.data.phone_state === false){
        set_number_taken(true)
     }
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(API_URL+"/api/address"); 
      if (response.status === 200) {
        setAddresses(response.data.addresses);
      } else {
        console.error("Server could not find addresses");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddress = (event) => {
    setChosenAddress(event.target.value);
    setProfile((prevProfile) => ({
      ...prevProfile,
      address_id: event.target.value
    }));
  };

  return (
    <div className={styles.mainContainer}>
      <h3 style={{ textAlign: "right" }}>Logged in as: {auth}</h3>
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={2}
      />
      <div className={styles.cvContainer}>
        <div className={styles.register}>
          <span className={styles.registerTitle}>
            Enter Your User Information
          </span>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
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
              style={{borderColor: number_taken ? 'red' : ''}}
            />
            {number_taken && <p style={{fontSize: '13px',color: 'red'}}>Change phone number.</p>}
            <label>Address</label>
            <select
              className="registerInput"
              name="address_id"
              onChange={handleAddress}
              value={chosenAddress}
            >
              <option value="" disabled>
                Select an address
              </option>
              {addresses.map((address) => (
                <option key={address.address_id} value={address.address_id}>
                  {address.zip_code}, {address.city}
                </option>
              ))}
            </select>

            <input
              className={styles.registerButton}
              type="submit"
              value="Create"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
