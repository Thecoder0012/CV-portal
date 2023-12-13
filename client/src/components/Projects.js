import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import { NavigationBar } from "./NavigationBar.js";
import mainCss from "../styles/auth.module.css";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/apiUrl.js";
import { useNavigate } from "react-router-dom";

export const Projects = () => {
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      author: "",
      done: 0,
      date_made: "",
      date_finish: "",
      file_path: null,
    },
  ]);

  const navigate = useNavigate();
  const WITH_CREDENTIALS = { withCredentials: true };

  const [assignedProjects, setAssignedProjects] = useState([]);
  const [roleId, setRoleId] = useState([]);
  const [requestedProjects,setRequestedProjects] = useState(null)

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL + "/api/projects");
      if (response.status === 200) {
        setProjects(response.data.projects);
      } else {
        console.error("Server could not find projects");
      }
    } catch (error) {
      console.log("catch");
      console.error("Error:", error);
    }
  };

   const fetchRequestedProjects = async () => {
     try {
       const response = await axios.get(API_URL + "/project-requests");
       if (response.status === 200) {
         setRequestedProjects(response.data.requestedProjects);
       } else {
         console.error("Server could not find requested projects");
       }
     } catch (error) {
       console.error("Error:", error);
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
      console.log("catch");
      console.error("Error:", error);
    }
  };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          API_URL + "/auth-login",
          WITH_CREDENTIALS
        );
        if (response.status === 200) {
          setRoleId(response.data.user.role_id); 
        } else {
          console.error("Server could not find user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  

  useEffect(() => {
    fetchUserRole()
    fetchProjects();
     if (roleId === 2) {
       fetchAssignedProjects();
       fetchRequestedProjects();
     }
  }, [roleId]);

  return (
    <div className={mainCss.mainContainer}>
      <NavigationBar />
      <h1 className={mainCss.Headline}>Projects</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {projects.map((project, i) => (
          <div
            key={i}
            className={`${mainCss.projectBox} ${
              assignedProjects.some(
                (assignedProject) => assignedProject.project_id === project.id
              ) && mainCss.assignedProject
            } ${
              requestedProjects &&
              requestedProjects.some(
                (requestedProject) => requestedProject.project_id === project.id
              ) &&
              mainCss.pendingRequest
            }`}
            onClick={() => {
              navigate(`/project/${project.id}`);
            }}
          >
            <div className={mainCss.projectDetailsContainer}>
              <h2 className={mainCss.h2}>{project.title}</h2>
              <p className={mainCss.projectDetails}>
                <strong>Status:</strong>
                {project.done ? "Finished" : "Not finished"}
                <br />
                <strong>Project first date:</strong>
                {new Date(project.date_made).toLocaleDateString()}
                <br />
                <strong>Project finished date:</strong>
                {new Date(project.date_finish).toLocaleDateString()}
                <br />
                {project.file_path && (
                  <a
                    href={API_URL + "/uploads/" + project.file_path}
                    target="_blank"
                    className={mainCss.pdfButton}
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
