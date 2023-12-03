import React, { useState, useEffect } from "react";
import styles from "../styles/projects.module.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/apiUrl.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavigationBar } from "./NavigationBar.js";

export const CreateProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    date_finish: "",
    manager_id: "",
    file_path: null,
  });
  const [managers, setManagers] = useState([]);
  const [chosenManager, setChosenManager] = useState([]);
  console.log(managers);

  const { title, description, date_finish, manager_id, file_path } = project;

  const fetchManagers = async () => {
    try {
      const response = await axios.get(API_URL + "/api/managers");
      setManagers(response.data.managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleInputChange = (event) => {
    setProject((prevProjects) => ({
      ...prevProjects,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePdfChange = (event) => {
    setProject((prevProjects) => ({
      ...prevProjects,
      file_path: event.target.files[0],
    }));
  };

  const handleManagers = (event) => {
    setChosenManager(event.target.value);
    setProject((prevProfile) => ({
      ...prevProfile,
      manager_id: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        API_URL + "/projects",
        {
          title: title,
          description: description,
          date_finish: date_finish,
          manager_id: manager_id,
          file: project.file_path,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

  return (
    <div className={styles.createProjects}>
    <NavigationBar/>
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={1}
      />
      <form className={styles.projectForm} onSubmit={handleSubmit}>
        <div className={styles.projectFormGroup}>
          <input
            type="text"
            placeholder="Project Title"
            name="title"
            className={styles.projectInput}
            autoFocus={true}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.projectFormGroup}>
          <textarea
            type="text"
            placeholder="Description"
            name="description"
            className={styles.writeProjectsText}
            onChange={handleInputChange}
          ></textarea>

          <input
            type="date"
            id="projectDate"
            className={styles.writeProjectsText}
            onChange={handleInputChange}
            name="date_finish"
          />
        </div>
<div className={styles.createProjectInputs}>
        <select 
            id="author"
            name="authorId"
            onChange={handleManagers}
            value={chosenManager}
            className={styles.author}
          >
            <option value="" disabled >
            Project Manager
            </option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name}
              </option>
            ))}
          </select>
          <input style={{ borderColor: 'rgba(161, 0, 255, 0.19)' }} 
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
        />

        <div className={styles.pdfPreview}>
          {file_path && (
            <a
              href={URL.createObjectURL(file_path)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Your Project
            </a>
          )}
          <button className={styles.projectSubmit} type="submit">
          Create project
        </button>
        </div>
        </div>
      </form>
    </div>
  );
};
