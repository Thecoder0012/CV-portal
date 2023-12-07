import React, { useEffect, useState } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/apiUrl.js";
import logo from "../images/logo.png";
import Navbar from "../styles/navBar.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";



export const NavigationBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [auth, setAuth] = useState();
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const WITH_CREDENTIALS = { withCredentials: true };

  async function fetchUser() {
    const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);

    const userRole = response.data.user.role_id === 1 ? "Manager" : "Employee";
    setRole(userRole);
  }


  async function fetchProfile() {
    const response = await axios.get(API_URL + "/profile", WITH_CREDENTIALS);
    setAuth(response.data[0].first_name);
    setUserId(response.data[0].person_id);
  }

  useEffect(() => {
    fetchUser();
    fetchProfile();
  }, []);



  const handleSignOut = async () => {
    const response = await axios.get(API_URL + "/logout", WITH_CREDENTIALS);

    if (response.status === 200) {
      toast.success(response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={1}
      />
      <nav className={Navbar.navContainer}>
        <div className={Navbar.logoContainer}>
          <NavLink to="/main">
            <img className={Navbar.logo} src={logo} alt="Logo" />
          </NavLink>
        </div>
        {role === "Employee" && (
          <div className={Navbar.Options}>        
            <NavLink to="/main" className={Navbar.Link} >
              <h4>Home</h4>
            </NavLink>
            <NavLink className={Navbar.Link} to="/projects">
              <h4>View Projects</h4>
            </NavLink>
          </div>
        )}
        {role === "Manager" && (
          <div className={Navbar.Options}>
          <NavLink to="/main" className={Navbar.Link}>
              <h4>Home</h4>
            </NavLink>
            <NavLink className={Navbar.Link} to="/projects">
              <h4>View Projects</h4>
            </NavLink>
            <NavLink className={Navbar.Link} to="/createProject">
              <h4>Create Project</h4>
            </NavLink>
            <NavLink className={Navbar.Link}  to="/searchSkills">
              <h4>Search Employee Skills</h4>
            </NavLink>
          </div>

        )}
        <div className={Navbar.iconWrapper}>
          <li className={Navbar.dropdown}>
            <h4 onClick={() => setDropdownVisible(!dropdownVisible)}>
              {auth} / {role}
            </h4>
            <FontAwesomeIcon
              icon={faCaretDown}
              className={Navbar.dropbtnArrow}
              style={{ color: "#A100FF" }}
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />

            {dropdownVisible && role === "Employee" && (
              <div className={Navbar.dropdownContent}>
                <NavLink to="/login" onClick={handleSignOut}>
                  Sign out
                </NavLink>
                <NavLink to={`/profile/update/${userId}`}>Update Profile</NavLink>
              </div>
            )}

            {dropdownVisible && role === "Manager" && (
              <div className={Navbar.dropdownContent}>
                <NavLink to="/login" onClick={handleSignOut}>
                  Sign out
                </NavLink>
                <NavLink to={`/profile/update/${userId}`}>Update Profile</NavLink>
                <NavLink to={`/registerManager`}>Create Manager</NavLink>
                <NavLink to={""}>View Managers / Employees</NavLink>
              </div>
            )}
          </li>
        </div>
      </nav>
    </div>
  );
};
