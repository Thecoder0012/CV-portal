import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/apiUrl.js";
import styles from "../../styles/profile/employeeDetails.module.css";

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
            skills.data.skills.find((skill) => skill.id === skillId).name || ""
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
        {profile && (
          <div>
            <h2>{profile.first_name + " " + profile.last_name}</h2>
            <p>
              <label style={{ fontStyle: "italic" }}>Employee-ID: </label>
              {"#" + profile.employee_id}
            </p>
            <p>
              <label style={{ fontStyle: "italic" }}>Date of birth: </label>
              {new Date(profile.date_of_birth).toLocaleDateString()}
            </p>
            <p>
              <label style={{ fontStyle: "italic" }}>Phone: </label>
              {profile.phone_number}
            </p>

            <p>
              <label style={{ fontStyle: "italic" }}>Skills: </label>
              {skillNames.join(", ")}
            </p>
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
