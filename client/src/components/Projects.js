import React, { useState } from "react";
import styles from "../styles/projects.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/apiUrl.js";

export const Projects = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { username, password } = credentials;
  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        API_URL + "/login",
        {
          username: username,
          password: password,
        },
        WITH_CREDENTIALS
      );

      if (response.status === 200) {
        navigate("/cv");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
    }
  };

  const handleInputChange = (event) => {
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={styles.createProjects}>
      <form className={styles.projectForm} onSubmit={handleSubmit}>
        <div className={styles.projectFormGroup}>
          <label htmlFor="fileInput">
            <i className="projectIcon fas fa-plus"></i>
          </label>
          <input
            type="text"
            placeholder="Title of your project"
            className={styles.projectInput}
            autoFocus={true}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.projectFormGroup}>
          <textarea
            placeholder="What was you project was about..."
            type="text"
            className={styles.writeProjectsText}
            onChange={handleInputChange}
          ></textarea>

          <textarea
            placeholder="Project file path..."
            type="text"
            className={styles.writeProjectsText}
            onChange={handleInputChange}
          ></textarea>

          <label htmlFor="projectStatus"></label>
          <select
            id="projectStatus"
            className={styles.projectFormGroupSelectStatus}
            onChange={handleInputChange}
            name="projectStatus"
          >
            <option value="fresh">Fresh</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <label htmlFor="projectDate"></label>
          <input
            type="date"
            id="projectDate"
            className={styles.projectFormGroupSelectDate}
            onChange={handleInputChange}
            name="projectDate"
          />

          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            Choose a picture
          </label>
          <input
            type="file"
            id="fileInput"
            className={styles.projectFile}
            onChange={handleInputChange}
          />
        </div>

        <button className={styles.projectSubmit} type="submit">
          Create project
        </button>
      </form>
    </div>
  );
};
