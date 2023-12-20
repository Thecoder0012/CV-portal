import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "../../styles//project/projectDetails.module.css";
import { API_URL } from "../../config/apiUrl.js";
import { NavigationBar } from "../main/NavigationBar.js";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [requestedProjects, setRequestedProjects] = useState([]);
  const [role_id, setRoleId] = useState();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [employeeId, setEmployeeID] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const WITH_CREDENTIALS = { withCredentials: true };
  const { id } = useParams();

  const getProject = async () => {
    try {
      const response = await axios.get(
        API_URL + "/projects/" + id,
        WITH_CREDENTIALS
      );
      setProject(response.data.getProject);
      if (response.data.role_id === role_id) {
        return;
      }
      setRoleId(response.data.role_id);
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
    }
  };

  const fetchRequestedProjects = async () => {
    try {
      const response = await axios.get(
        API_URL + "/project-requests",
        WITH_CREDENTIALS
      );
      if (response.status === 200) {
        setEmployeeID(response.data.employee_id);
        setRequestedProjects((prevRequestedProjects) => {
          if (
            JSON.stringify(prevRequestedProjects) ===
            JSON.stringify(response.data.requestedProjects)
          ) {
            return prevRequestedProjects;
          }

          return response.data.requestedProjects;
        });
      } else {
        console.error("Server could not find requested projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const requestProject = async () => {
    try {
      const response = await axios.post(
        API_URL + "/request-project",
        {
          project_id: id,
        },
        WITH_CREDENTIALS
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      fetchRequestedProjects();
    } catch (error) {
      console.error("Error assigning project:", error);
    }
  };

  const fetchAssignedProjects = async () => {
    try {
      const response = await axios.get(
        API_URL + "/assigned-projects",
        WITH_CREDENTIALS
      );
      if (response.status === 200) {
        setAssignedProjects(response.data);
      } else {
        console.error("Server could not find projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAssignedEmployees = async () => {
    const projectId = project.project_id;

    const response = await axios.get(
      `${API_URL}/projects/assigned/${projectId}`
    );
    setAssignedEmployees(response.data.assignedEmployees);
  };

  useEffect(() => {
    getProject();
    if (role_id === 2) {
      fetchAssignedProjects();
      fetchRequestedProjects();
    }
    fetchAssignedEmployees();
  }, [requestedProjects, role_id]);

  function displayAssigned(numberOfAssignedEmployees) {
    if (numberOfAssignedEmployees > 1) {
      Swal.fire({
        title: project.title,
        html: `
        <div id="swalContainer" style="display: inline-flex">
        <ol>${assignedEmployees
          .map((employee) => `<li>${employee}</li>`)
          .join("")}</ol>
          <div>
          `,
        showCloseButton: true,
        confirmButtonColor: "#a100ff",
      });
    } else if (numberOfAssignedEmployees === 1) {
      Swal.fire({
        title: project.title,
        html: `
        <div id="swalContainer" style="display: inline-flex">
        <ol>
        <li>
        ${assignedEmployees}
        </li>
        </ol>
          <div>
          `,
        showCloseButton: true,
        confirmButtonColor: "#a100ff",
      });
    } else {
      Swal.fire({
        title: project.title,
        text: "No employees assigned.",
        showCloseButton: true,
        confirmButtonColor: "#a100ff",
      });
    }
  }

  return (
    <div>
      <NavigationBar />

      <div className={styles.singleProject}>
        <h1 className={styles.projectTitle}>{project.title}</h1>
        <div className={styles.projectDetails}>
          <p>
            <strong>Project Description: </strong> {project.description}
          </p>
          <p>
            <strong>Project Manager: </strong> {project.first_name}
          </p>
          <p>
            <strong>Status: </strong>
            {project.done ? "Completed" : "Active"}
          </p>
          <p>
            <strong>Project Created: </strong>
            {new Date(project.date_made).toLocaleDateString()}
          </p>
          <p>
            <strong>Project End Date: </strong>
            {new Date(project.date_finish).toLocaleDateString()}
          </p>
          <div className={styles.assignedEmployees}>
            {project.file_path && (
              <a
                href={API_URL + "/uploads/" + project.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewPdfLink}
              >
                View PDF
              </a>
            )}
            <div>
              <h4 style={{ textAlign: "left" }}>Assigned</h4>
              <ul
                className={styles.assignedNames}
                onClick={() => {
                  displayAssigned(assignedEmployees.length);
                }}
              >
                {assignedEmployees.length > 1 ? (
                  <li>
                    {assignedEmployees[0]} +{assignedEmployees.length - 1}{" "}
                    more...
                  </li>
                ) : assignedEmployees.length === 1 ? (
                  <li>{assignedEmployees}</li>
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </div>
          {role_id === 2 &&
            !assignedProjects.some(
              (assignedProjects) =>
                assignedProjects.project_id === project.project_id
            ) &&
            !requestedProjects.some(
              (requestProject) =>
                requestProject.project_id === project.project_id &&
                requestProject.employee_id === employeeId &&
                requestProject.status === 1
            ) && (
              <button className={styles.requestButton} onClick={requestProject}>
                Assign me
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
