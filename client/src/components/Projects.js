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

  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const { username, password } = credentials;
  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your submission logic
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
          setPdfPreview(null);
        };
        reader.readAsDataURL(file);
      }

      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Set the PDF preview as a Blob URL
          setPdfPreview(URL.createObjectURL(new Blob([file])));
          setImagePreview(null);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handlePdfChange = (event) => {
    // Update the state with the selected PDF file
    setProfile((prevProfile) => ({
      ...prevProfile,
      pdf_file: event.target.files[0],
    }));
  };

  return (
    <div className={styles.createProjects}>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected"
          className={styles.imagePreview}
        />
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
            name="projectDate"
          />

          {pdfPreview && (
            <div className={styles.pdfPreview}>
              <img
                src="../pdf/pdf-icon.png"
                alt="PDF Icon"
                onClick={() => window.open(pdfPreview, "_blank")}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}

          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            Insert your CV
          </label>
          <input
            type="file"
            id="fileInput"
            className={styles.projectFile}
            onChange={handleInputChange}
            name="cvInput"
          />

          <label>Upload PDF</label>
          <input type="file" accept=".pdf" onChange={handlePdfChange} />

          {profile.pdf_file && (
            <a
              href={URL.createObjectURL(profile.pdf_file)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Your PDF file
            </a>
          )}
        </div>

        <button className={styles.projectSubmit} type="submit">
          Create project
        </button>
      </form>
    </div>
  );
};
