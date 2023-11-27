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

  const [imagePreview, setImagePreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

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
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [event.target.name]: event.target.value,
    }));

    if (event.target.type === "file") {
      const file = event.target.files[0];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfFile(reader.result);
        };
        reader.readAsArrayBuffer(file);
      }
    } else {
      setProject((prevProject) => ({
        ...prevProject,
        [event.target.name]: event.target.value,
      }));
    }
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

        {pdfFile && (
          <div className={styles.pdfPreview}>
            <p
              onClick={() => {
                const blob = new Blob([pdfFile], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
              }}
              style={{ cursor: "pointer" }}
            >
              {pdfFile.name || "CV File"}
            </p>
          </div>
        )}

        <div className={styles.projectFormGroup}>
          {!pdfFile && (
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Insert your CV
            </label>
          )}
          {!pdfFile && (
            <input
              type="file"
              id="fileInput"
              className={styles.projectFile}
              accept=".pdf"
              onChange={handleInputChange}
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
