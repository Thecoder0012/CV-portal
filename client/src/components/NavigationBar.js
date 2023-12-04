import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  //Homepage component
  //Logik i navbar med manager / employee

  //

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
          <Link to="/main">
            <img className={Navbar.logo} src={logo} alt="Logo" />
          </Link>
        </div>
        {role === "Employee" && (
          <div className={Navbar.Options}>
            <Link to="/main" className={Navbar.Link}>
              <h4>Home</h4>
            </Link>
            <Link className={Navbar.Link} to="/projects">
              <h4>View Projects</h4>
            </Link>
          </div>
        )}
        {role === "Manager" && (
          <div className={Navbar.Options}>
            <Link to="/main" className={Navbar.Link}>
              <h4>Home</h4>
            </Link>
            <Link className={Navbar.Link} to="/projects">
              <h4>View Projects</h4>
            </Link>
            <Link className={Navbar.Link} to="/createProject">
              <h4>Create Project</h4>
            </Link>
            <Link className={Navbar.Link} to="/searchSkills">
              <h4>Search Employee Skills</h4>
            </Link>
          </div>
        )}
        <div className={Navbar.iconWrapper}>
          <li className={Navbar.dropdown}>
            <h4>
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
                <Link to="/login" onClick={handleSignOut}>
                  Sign out
                </Link>
                <Link to={`/profile/update/${userId}`}>Update Profile</Link>
              </div>
            )}

            {dropdownVisible && role === "Manager" && (
              <div className={Navbar.dropdownContent}>
                <Link to="/login" onClick={handleSignOut}>
                  Sign out
                </Link>
                <Link to={`/profile/update/${userId}`}>Update Profile</Link>
                <Link to={`/profile/update/${userId}`}>Create Manager</Link>
                <Link to={""}>View Managers / Employees</Link>
              </div>
            )}
          </li>
        </div>
      </nav>
    </div>
  );
};
