import React, { useState, useEffect } from "react";
import styles from "../../styles/auth/auth.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config/apiUrl";
import { NavigationBar } from "../main/NavigationBar";
import { useParams } from "react-router-dom";

export const UpdatePerson = () => {
  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState();
  const [departments, setDepartments] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  async function fetchUser() {
    const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);

    const userRole = response.data.user.role_id === 1 ? "Manager" : "Employee";
    setRole(userRole);
  }

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    department_id: "",
    skills: [],
  });

  const { id } = useParams();

  const { first_name, last_name, date_of_birth, phone_number, department_id } =
    profile;
  const WITH_CREDENTIALS = { withCredentials: true };

  async function getProfileData() {
    try {
      const response = await axios.get(
        API_URL + "/profile/" + id,
        WITH_CREDENTIALS
      );
      if (response.status === 200) {
        const userProfile = response.data[0];
        setProfile({
          ...profile,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          date_of_birth: userProfile.date_of_birth,
          phone_number: userProfile.phone_number,
          department_id: userProfile.department_id,
          skills: response.data.skills,
        });
      }
    } catch (error) {
      toast.error(error);
    }
  }
  useEffect(() => {
    getProfileData();
    fetchDepartments();
    fetchSkills();
    fetchUser();
  }, []);

  useEffect(() => {
    setSelectedSkills(profile.skills);
  }, [profile]);

  const handleInputChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "Employee") {
      try {
        const skills_ids = selectedSkills.map(Number);
        const response = await axios.put(
          API_URL + "/profile/employee/" + id,
          {
            first_name: first_name,
            last_name: last_name,
            date_of_birth: formatDate(date_of_birth),
            phone_number: phone_number,
            department_id: department_id,
            skills: skills_ids,
          },
          WITH_CREDENTIALS
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else if (role === "Manager") {
      try {
        const response = await axios.put(
          API_URL + "/profile/manager/" + id,
          {
            first_name: first_name,
            last_name: last_name,
            date_of_birth: formatDate(date_of_birth),
            phone_number: phone_number,
          },
          WITH_CREDENTIALS
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message);
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
    const selectedSkill = +event.target.value;

    setSelectedSkills((prevSkills) => {
      if (prevSkills.includes(selectedSkill)) {
        return prevSkills.filter((skill) => skill !== selectedSkill);
      } else {
        return [...prevSkills, selectedSkill];
      }
    });

    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: prevProfile.skills.includes(selectedSkill)
        ? prevProfile.skills.filter((skill) => skill !== selectedSkill)
        : [...prevProfile.skills, selectedSkill],
    }));
  };

  return (
    <div className={styles.mainContainer}>
      <NavigationBar />
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
              className=""
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
            />
            {role === "Employee" && (
              <div>
                <label>Department</label>
                <select
                  className={styles.registerInput}
                  name="department_id"
                  onChange={handleDepartments}
                  value={profile.department_id}
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
                <h3 className={styles.skillsContainer}>Skills</h3>
                <div className={styles.checkboxContainer}>
                  {skills.map((skill) => (
                    <div key={skill.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        id={skill.id}
                        name="skills"
                        value={skill.id}
                        onChange={handleSkills}
                        checked={selectedSkills.includes(skill.id)}
                      />
                      <h5 htmlFor={skill.id}>{skill.name}</h5>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
