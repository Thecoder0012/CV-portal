import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/apiUrl.js";
import styles from "../styles/employeeDetails.module.css";

const EmployeeDetails = ({ onClose, id }) => {
  const [profile, setProfile] = useState(null);
  const [skillNames, setSkillNames] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await axios.get(API_URL + "/profile/" + id);
        const skills = await axios.get(API_URL + "/api/skills");

        setProfile(profile.data[0]);

        const personSkills = profile.data.skills.map(
          (skillId) =>
            skills.data.find((skill) => skill.id === skillId).name || ""
        );

        setSkillNames(personSkills);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Employee Profile</h2>
        {profile && (
          <div>
            <p>Employee ID: {profile.employee_id}</p>
            <p>First Name: {profile.first_name}</p>
            <p>Last Name: {profile.last_name}</p>
            <p>
              Date of Birth:
              {new Date(profile.date_of_birth).toLocaleDateString()}
            </p>
            <p>Phone Number: {profile.phone_number}</p>

            <p>Skills: {skillNames.join(", ")}</p>
            
          </div>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
