import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/apiUrl.js";
import logo from "../../resources/images/logo.png"
import Navbar from "../../styles/main/navBar.module.css";
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
  const location = useLocation();

  async function fetchUser() {
    const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);

    const userRole = response.data.user.role_id === 1 ? "Manager" : "Employee";
    setRole(userRole);
  }

  async function fetchProfile() {
    const response = await axios.get(API_URL + "/profile", WITH_CREDENTIALS);
    setAuth(response.data[0]?.first_name);
    setUserId(response.data[0]?.person_id);
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
          <Link to="/main">
            <img className={Navbar.logo} src={logo} alt="Logo" />
          </Link>
        </div>
        {role === "Employee" && (
          <div className={Navbar.Options}>
            <Link
              to="/main"
              className={`${Navbar.Link} ${
                location.pathname === "/main" ? Navbar.activeLink : ""
              }`}
            >
              <h4>Home</h4>
            </Link>
            <Link
              className={`${Navbar.Link} ${
                location.pathname === "/projects" ? Navbar.activeLink : ""
              }`}
              to="/projects"
            >
              <h4>View Projects</h4>
            </Link>
          </div>
        )}
        {role === "Manager" && (
          <div className={Navbar.Options}>
            <Link
              to="/main"
              className={`${Navbar.Link} ${
                location.pathname === "/main" ? Navbar.activeLink : ""
              }`}
            >
              <h4>Home</h4>
            </Link>
            <Link
              className={`${Navbar.Link} ${
                location.pathname === "/projects" ? Navbar.activeLink : ""
              }`}
              to="/projects"
            >
              <h4>View Projects</h4>
            </Link>
            <Link
              className={`${Navbar.Link} ${
                location.pathname === "/createProject" ? Navbar.activeLink : ""
              }`}
              to="/createProject"
            >
              <h4>Create Project</h4>
            </Link>
            <Link
              className={`${Navbar.Link} ${
                location.pathname === "/searchSkills" ? Navbar.activeLink : ""
              }`}
              to="/searchSkills"
            >
              <h4>Search Employee Skills</h4>
            </Link>
          </div>
        )}
        <div
          className={Navbar.iconWrapper}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <li className={Navbar.dropdown}>
            <h4>
              {auth} / {role}
            </h4>
            <FontAwesomeIcon
              icon={faCaretDown}
              className={Navbar.dropbtnArrow}
              style={{ color: "#A100FF" }}
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
                <Link to={"/manager/projects"}>Manage Projects</Link>
                <Link to={"/manager/assignEmployees"}>Project Assignment</Link>
                <Link to={`/profile/update/${userId}`}>Update Profile</Link>
                <Link to={`/registerManager`}>Register Manager</Link>
              </div>
            )}
          </li>
        </div>
      </nav>
    </div>
  );
};
