import React, { useEffect, useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { API_URL } from "../config/apiUrl";
import axios from "axios";
import styles from "../styles/assignment.module.css";

const ProjectAssignment = () => {
  const [projects, setProjects] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    fetchProjects(); 
  }, [currentPage]);

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

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject,indexOfLastProject);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const renderPaginationItems = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`${styles.paginationItem} ${
            i === currentPage && styles.active
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </li>
      );
    }
    return paginationItems;
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.tableContainer}>
        <h2 className={styles.tableHeader}>Projects</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Title</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className={styles.pagination}>{renderPaginationItems()}</ul>
      </div>
    </div>
  );
};

export default ProjectAssignment;
