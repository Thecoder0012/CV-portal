import React, { useState, useEffect } from "react";
import styles from "../styles/auth.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../config/apiUrl";

export const UpdateEmployee = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    department_id: "",
    skills: [],
    pdf_file: null,
  });

  const [departments, setDepartments] = useState([]);
  const [chosenDepartment, setChosenDepartment] = useState("");
  const [number_taken, set_number_taken] = useState(false);

  const { first_name, last_name, date_of_birth, phone_number, department_id } =
    profile;

  const [auth, setAuth] = useState();
  const WITH_CREDENTIALS = { withCredentials: true };

  async function authName() {
    const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);
    setAuth(response.data.user.username);
  }

  async function getProfileData() {
    const response = await axios.get(API_URL + "/profile", WITH_CREDENTIALS);
    if (response.status === 200) {
      const userProfile = response.data[0];
      setProfile({
        ...profile,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        date_of_birth: userProfile.date_of_birth,
        phone_number: userProfile.phone_number,
        skills: response.data.skills,
      });
    } else {
      console.log(response.status);
    }
  }

  useEffect(() => {
    authName();
    getProfileData();
    fetchDepartments();
    fetchSkills();
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
      const response = await axios.put(
        API_URL + "/profile",
        {
          first_name: first_name,
          last_name: last_name,
          date_of_birth: formatDate(date_of_birth),
          phone_number: phone_number,
          department_id: department_id,
          skills: selectedSkills,
        },
        WITH_CREDENTIALS
      );

      if (response.status === 200) {
        set_number_taken(false);
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      set_number_taken(false);

      if (err.response.data.phone_state === false) {
        set_number_taken(true);
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
  const handleDepartments = (event) => {
    setChosenDepartment(event.target.value);
    setProfile((prevProfile) => ({
      ...prevProfile,
      department_id: event.target.value,
    }));
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(API_URL + "/api/skills");
      if (response.status === 200) {
        setSkills(response.data.skills);
      } else {
        console.error("Server could not find skills");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const handleSkills = (event) => {
    const selectedSkill = event.target.value;
    if (selectedSkills.includes(selectedSkill)) {
      setSelectedSkills((prevSkills) =>
        prevSkills.filter((skill) => skill !== selectedSkill)
      );
    } else {
      setSelectedSkills((prevSkills) => [...prevSkills, selectedSkill]);
    }
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
          <span className={styles.registerTitle}>Update profile</span>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              className="registerInput"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
            />
            <label>Last Name</label>
            <input
              type="text"
              className="registerInput"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
            />
            <label>Date Of Birth</label>
            <input
              type="date"
              className="registerInput"
              name="date_of_birth"
              value={formatDate(profile.date_of_birth)}
              onChange={handleInputChange}
            />
            <label>Phone</label>
            <input
              type="text"
              className="registerInput"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleInputChange}
              style={{ borderColor: number_taken ? "red" : "" }}
            />
            {number_taken && (
              <p style={{ fontSize: "13px", color: "red" }}>
                Change phone number.
              </p>
            )}
            <label>Department</label>
            <select
              className="registerInput"
              name="department_id"
              onChange={handleDepartments}
              value={chosenDepartment}
              required
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

            <label>Skills</label>
            {skills.map((skill) => (
              <div key={skill.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={skill.id}
                  name="skills"
                  value={skill.id}
                  onChange={handleSkills}
                  defaultChecked={selectedSkills.includes(skill.id)}
                />
                <label htmlFor={skill.id}>{skill.name}</label>
              </div>
            ))}

            <input
              className={styles.registerButton}
              type="submit"
              value="Update"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
