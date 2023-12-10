import React, { useEffect, useState } from "react";
import { NavigationBar } from "./NavigationBar";
import { API_URL } from "../config/apiUrl";
import axios from "axios";
import styles from "../styles/assignment.module.css";
import { FaUsers, FaTrash, FaTimes } from "react-icons/fa";
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
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={3}
      />
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
                    className={styles.assignButton}
                    onClick={() => toggleEmployeeModal(project)}
                  >
                    <FaUsers size={20} />
                    <span>Assign Employee</span>
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
              <h2 className={styles.tableHeader}>
                Employee Assignment <br></br>
                <br></br>
                To: {selectedProject.title} -- {selectedProject.id}
              </h2>
              <table className={styles.employeeTable}>
                <thead>
                  <tr>
                    <th>Employee ID:</th>
                    <th>Name</th>
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
                      <td>{employee.skills}</td>
                      <td
                        style={{
                          color:
                            employee.projects &&
                            employee.projects.includes(
                              String(selectedProject.id)
                            )
                              ? "green"
                              : "red",
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
                            style={{ background: "red" }}
                            className={styles.assignButton}
                            onClick={() =>
                              removeEmployeeFromProject(employee.employee_id)
                            }
                          >
                            <FaTrash size={20} />
                            <span>Remove</span>
                          </button>
                        ) : (
                          <button
                            style={{ background: "green" }}
                            className={styles.assignButton}
                            onClick={() =>
                              assignEmployeeToProject(employee.employee_id)
                            }
                          >
                            <FaUsers size={20} />
                            <span>Assign</span>
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
            <button
              onClick={toggleEmployeeModal}
              className={styles.closeButton}
            >
              <FaTimes size={20} />
              <span>Close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

