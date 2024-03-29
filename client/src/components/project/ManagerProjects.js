import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/project/ManagerProjects.module.css";
import { API_URL } from "../../config/apiUrl.js";
import UpdateProjectPopup from "./UpdateProjectPopup.js";

export const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const projectsPerPage = 4;

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL + "/api/all-projects");
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
  }, [projects]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div>
      <h1 className={styles.Headline}>Manage Archived Projects</h1>
      <div className={styles.projectContainer}>
        <table className={styles.projectsTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Project Start/Date</th>
              <th>Project End/Date</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentProjects.map((project, i) => (
              <tr
                key={i}
                className={`${styles.tableRow} ${styles.projectRow}`}
                onClick={() => {
                  handleUpdateClick(project.id);
                }}
              >
                <td className={styles.projectTitle}>{project.title}</td>
                <td
                  style={{
                    color: project.done ? "green" : "#a100ff",
                    textDecoration: project.done ? "line-through" : "underline",
                  }}
                >
                  {project.done ? "Completed" : "Active"}
                </td>
                <td>{new Date(project.date_made).toLocaleDateString()}</td>
                <td>{new Date(project.date_finish).toLocaleDateString()}</td>
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
              className={index + 1 === currentPage ? styles.activeButton : ""}
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
