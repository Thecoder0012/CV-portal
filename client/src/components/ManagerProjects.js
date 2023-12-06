/*import React, { useState, useEffect } from "react";
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
      <h1 className={styles.Headline}>Manager archive Projects</h1>
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
};*/



import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavigationBar } from "./NavigationBar.js";
import styles from "../styles/ManagerProjects.module.css";
import { API_URL } from "../config/apiUrl.js";
import { useNavigate } from "react-router-dom";
import UpdateProjectPopup from "./UpdateProjectPopup";

export const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

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

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleDetailsClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleUpdateClick = (projectId) => {
    setSelectedProjectId(projectId);
  };


  return (
    <div className={styles.mainContainer}>
      <NavigationBar />
      <h1 className={styles.Headline}>Manager archive Projects</h1>
      <div className={styles.projectContainer}>
        <table className={styles.projectsTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Project first date</th>
              <th>Project finished date</th>
              <th>Actions</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, i) => (
              <tr key={i} className={`${styles.tableRow} ${styles.projectRow}`}>
                <td
                  className={styles.projectTitle}
                  onClick={() => handleProjectClick(project.id)}
                >
                  {project.title}
                </td>
                <td>{project.done ? "Finished" : "Not finished"}</td>
                <td>{new Date(project.date_made).toLocaleDateString()}</td>
                <td>{new Date(project.date_finish).toLocaleDateString()}</td>
                <td>
                  <button
                    className={`${styles.updateButton} ${styles.updateButton}`}
                    onClick={() => handleUpdateClick(project.id)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className={`${styles.detailsButton} ${styles.detailsButton}`}
                    onClick={() => handleDetailsClick(project.id)}
                  >
                    Details
                  </button>
                </td>
                 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(projects.length / projectsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? styles.active : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
      {selectedProjectId && (
        <UpdateProjectPopup
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
          onUpdate={fetchProjects}
        />
      )}
    </div>
  );
};

