import React, { useEffect, useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { API_URL } from "../config/apiUrl";
import axios from "axios";
import styles from "../styles/assignment.module.css";
import { FaUsers, FaTimes } from "react-icons/fa";
import { MdPersonRemove } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProjectAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const WITH_CREDENTIALS = { withCredentials: true };

  const [currentProjectPage, setCurrentProjectsPage] = useState(1);
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastProject = currentProjectPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  
  const indexOfLastEmployee = currentEmployeePage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee,indexOfLastEmployee);

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, [employees]);

  
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL + "/api/person-skills");
      if (response.status === 200) {
        setEmployees(response.data.employees);
      } else {
        console.error("Server could not find projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const paginate = (currentPage, setCurrentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
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

  const toggleEmployeeModal = (project) => {
    setSelectedProject(project);
    setShowEmployeeModal(!showEmployeeModal);
  };

  const assignEmployeeToProject = async (employee_id) => {
    console.log(employee_id);
    console.log(selectedProject.id);
    try {
      const response = await axios.post(
        API_URL + "/project-assignment",
        {
          project_id: selectedProject.id,
          employee_id: employee_id,
        },
        WITH_CREDENTIALS
      );
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const removeEmployeeFromProject = async (employee_id) => {
    try {
      const response = await axios.delete(
        API_URL +
          "/project-assignment/" +
          employee_id +
          "/" +
          selectedProject.id
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr className={styles.employeeRow} key={project.id}>
                <td>{project.title}</td>
                <td>
                <button
                style={{ position: "relative", left: "55%" }}
                className={styles.assignEmployee}
                onClick={() => toggleEmployeeModal(project)}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  Assign Employee
                </span>
              </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className={styles.pagination}>
          {paginate(
            currentProjectPage,
            setCurrentProjectsPage,
            projects.length
          )}
        </ul>

        {showEmployeeModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
            <button
              onClick={toggleEmployeeModal}
              className={styles.closeButton}
            >
              <FaTimes size={20} />
            </button>
              <h2 className={styles.tableHeader}>
              <h3>Assign Employees</h3>
              <h4 style={{fontWeight: "300"}}>{selectedProject.title} / #{selectedProject.id}</h4>
              </h2>
              <table className={styles.employeeTable}>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Assignment</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr className={styles.employeeRow} key={employee.id}>
                      <td>{employee.employee_id}</td>
                      <td>{employee.first_name}</td>
                      <td>{employee.last_name}</td>
                      <td>
                      <span className={styles.employeeSkills}>{employee.skills}</span>
                    </td>
                    <td
                        style={{
                          color:
                            employee.projects &&
                            employee.projects.includes(
                              String(selectedProject.id)
                            )
                              ? "green"
                              : "#c70000",
                        }}
                      >
                        {employee.projects &&
                        employee.projects.includes(String(selectedProject.id))
                          ? "Assigned"
                          : "Not assigned"}
                      </td>
                      <td>
                        {employee.projects &&
                        employee.projects.includes(
                          String(selectedProject.id)
                        ) ? (
                          <button
                            style={{ background: "none" }}
                            className={styles.assignButton}
                            onClick={() =>
                              removeEmployeeFromProject(employee.employee_id)
                            }
                          >
                            <span style={{ display: "flex", alignItems: "center" }}>Remove
                            <MdPersonRemove size={15} style={{ marginLeft: "5px" }} />
                            </span>
                          </button>
                        ) : (
                          <button
                            style={{ color: "green" }}
                            className={styles.assignButton}
                            onClick={() =>
                              assignEmployeeToProject(employee.employee_id)
                            }
                          >
                        
                            <span style={{ display: "flex", alignItems: "center" }}>Assign
                            <FaUsers size={15} style={{ marginLeft: "5px" }} />
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className={styles.pagination}>
                {paginate(
                  currentEmployeePage,
                  setCurrentEmployeePage,
                  employees.length
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

