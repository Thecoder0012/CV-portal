import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/projectDetails.module.css";
import { API_URL } from "../config/apiUrl.js";
import { NavigationBar } from "./NavigationBar.js";
import Swal from "sweetalert2";

export const ProjectDetails = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    author: "",
    done: 0,
    date_made: "",
    date_finish: "",
    file_path: null,
  });

  const WITH_CREDENTIALS = { withCredentials: true };

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const getProject = async () => {
    try {
      const response = await axios.get(API_URL + "/projects/" + id);
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <div>
      <NavigationBar />
      <div className={styles.singleProject}>
        <h1 className={styles.projectTitle}>{project.title}</h1>
        <div className={styles.projectDetails}>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Author:</strong> {project.author}
          </p>
          <p>
            <strong>Status:</strong> {project.done ? "Finished" : "Not finished"}
          </p>
          <p>
            <strong>Date Made:</strong>{" "}
            {new Date(project.date_made).toLocaleDateString()}
          </p>
          <p>
            <strong>Date Finish:</strong>{" "}
            {new Date(project.date_finish).toLocaleDateString()}
          </p>
          <p>
            <strong>Pdf:</strong> {project.file_path}
          </p>
          {project.file_path && (
            <a
              href={API_URL + "/uploads/" + project.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewPdfLink}
            >
              View Project PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
};




