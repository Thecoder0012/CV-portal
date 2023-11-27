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

  const [project, setProject] = useState({
    project_title: "",
    project_description: "",
    project_author: "",
    project_done: "",
    date_made: "",
    date_finish: "",
    project_file_path: "",
  });

  console.log(project);
  const [imagePreview, setImagePreview] = useState(null);

  const { username, password } = credentials;
  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL + "/projects/createProject", {
        project_title: project.project_title,
        project_description: project.project_description,
        project_author: project.project_author,
        project_done: project.project_done,
        date_made: project.date_made,
        date_finish: project.date_finish,
        project_file_path: project.project_file_path,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
    }
  };

  const handleInputChange = (event) => {
    setProject((prevProjects) => ({
      ...prevProjects,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePdfChange = (event) => {
    setProject((prevProjects) => ({
      ...prevProjects,
      project_file_path: event.target.files[0],
    }));
  };

  return (
    <div className={styles.createProjects}>
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Selected"
            className={styles.imagePreview}
          />
        </div>
      )}
      <form className={styles.projectForm} onSubmit={handleSubmit}>
        <div className={styles.projectFormGroup}>
          {!imagePreview && (
            <div>
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
          )}

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
            placeholder="What was your project about..."
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
            <option value="notStarted">Not started</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <label htmlFor="projectDate"></label>
          <input
            type="date"
            id="projectDate"
            className={styles.projectFormGroupSelectDate}
            onChange={handleInputChange}
            name="projectDateFinish"
          />
        </div>

        {project.project_file_path && (
          <div className={styles.pdfPreview}>
            <p
              onClick={() => {
                const blob = new Blob([project.project_file_path], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
              }}
              style={{ cursor: "pointer" }}
            >
              {project.project_file_path.name || "CV File"}
            </p>
          </div>
        )}

        <div className={styles.projectFormGroup}>
          {!project.project_file_path && (
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Insert your CV
            </label>
          )}
          {!project.project_file_path && (
            <input
              type="file"
              id="fileInput"
              className={styles.projectFile}
              accept=".pdf"
              onChange={handlePdfChange}
              name="cvInput"
            />
          )}
        </div>
        <button
          className={styles.projectSubmit}
          type="submit"
          onChange={handleSubmit}
        >
          Create project
        </button>
      </form>
    </div>
  );
};
