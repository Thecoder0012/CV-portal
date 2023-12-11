import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavigationBar } from "./NavigationBar.js";
import styles from "../styles/ManagerProjects.module.css";
import { API_URL } from "../config/apiUrl.js";
import UpdateProjectPopup from "./UpdateProjectPopup";


export const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  const handleUpdateClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleUpdateRow = (e) => {
    const projectId = e.currentTarget.dataset.projectId;
    handleUpdateClick(projectId);
  };


  return (
    <div>
      <NavigationBar />
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
          <tbody style={{textAlign: "center"}}>
            {currentProjects.map((project, i) => (
              <tr key={i} className={`${styles.tableRow} ${styles.projectRow}`} onClick={() => {handleUpdateClick(project.id)}}>
                <td 
                  className={styles.projectTitle}
                >
                  {project.title}
                </td>
                <td style={{ color: project.done ? 'green' : 'red' }}>
              {project.done ? 'Finished' : 'Not finished'}
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
        className={index + 1 === currentPage ? styles.activeButton : ''}
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

//Project assigntment - Fontfamily lato
//Pagination knapper laves om til lilla
//Gør knapperne lidt mørkere i pagination, så man kan se hvilken side man er på
//Style pop up i Employee Assigment og lad skills være lilla ligesom i Search EMployee Skills

