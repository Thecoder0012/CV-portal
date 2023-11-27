import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/auth.module.css";
import { API_URL } from "../config/apiUrl.js";

export const CvProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    department_id: "",
    skills: [],
    pdf_file: null
  });

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [chosenDepartment, setChosenDepartment] = useState("");
    const [number_taken, set_number_taken] = useState(false);

    const { first_name, last_name, date_of_birth, phone_number, department_id } = profile;
    
    const [auth, setAuth] = useState();
    const WITH_CREDENTIALS = { withCredentials: true };

   async function authName() {
     const response = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);
     setAuth(response.data.user.username)
  }

  useEffect(() => {
    authName()
    fetchDepartments();
    fetchSkills()
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
        department_id: department_id,
        skills: selectedSkills,
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL+"/api/departments"); 
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
      department_id: event.target.value
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

  const handleSkills = (event) => {
    const selectedSkill = event.target.value;
    if (selectedSkills.includes(selectedSkill)) {
      setSelectedSkills((prevSkills) => prevSkills.filter((skill) => skill !== selectedSkill));
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
            <label>Department</label>
            <select
              className="registerInput"
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

          <label>Upload PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
              />

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
