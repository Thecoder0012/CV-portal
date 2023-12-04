import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavigationBar } from "./NavigationBar.js";
import styles from "../styles/ManagerProjects.module.css";
import { API_URL } from "../config/apiUrl.js";
import { useNavigate } from "react-router-dom";

export const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const navigate = useNavigate();

  //Opdater projekt knap
  // Add project members knap
  // Hover effekt når du hover over boksene
  //

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL + "/api/projects");
      if (response.status === 200) {
        setProjects(response.data.projects);
      } else {
        console.error("Server could not find projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateClick = (projectId) => {};

  return (
    <div className={styles.mainContainer}>
      <NavigationBar />
      <h1 className={styles.Headline}>Manager Created Projects</h1>
      <div className={styles.projectContainer}>
        {currentProjects.map((project, i) => (
          <div
            key={i}
            className={styles.projectBox}
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className={styles.projectDetailsContainer}>
              <h2 className={styles.projectTitle}>{project.title}</h2>
              <p className={styles.projectDetails}>
                <strong>Status:</strong>{" "}
                {project.done ? "Finished" : "Not finished"}
                <br />
                <strong>Project first date:</strong>{" "}
                {new Date(project.date_made).toLocaleDateString()}
                <br />
                <strong>Project finished date:</strong>{" "}
                {new Date(project.date_finish).toLocaleDateString()}
                <br />
                {project.file_path && (
                  <a
                    href={API_URL + "/uploads/" + project.file_path}
                    target="_blank"
                    className={styles.pdfButton}
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                )}
              </p>
              <button
                className={styles.updateButton}
                onClick={() => handleUpdateClick(project.id)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
      {}
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(projects.length / projectsPerPage) },
          (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};
