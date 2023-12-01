import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavigationBar } from './NavigationBar.js';
import mainCss from "../styles/auth.module.css"
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/apiUrl.js";
import { Link } from "react-router-dom";

export const Projects = () => {

 const [projects, setProjects] = useState([{
   title: "",
   description: "",
   author: "",
   done: 0,
   date_made: "",
   date_finish: "",
   file_path: null,
 }]);

 const styles = {
   projectBox: {
     border: "1px solid #ddd",
     borderRadius: "8px",
     padding: "16px",
     margin: "16px",
     width: "300px",
   },
 };


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


      useEffect(() => {
        fetchProjects()
      }, []);
  
return (
  <div className={mainCss.mainContainer}>
<NavigationBar/>
    <h1>Project List</h1>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {projects.map((project, i) => (
        <div key={i} style={styles.projectBox}>
          <h2>{project.title}</h2>
          <p>
            <strong>Description:</strong> {project.description}
            <br />
            <strong>Author:</strong> {project.author}
            <br />
            <strong>Status:</strong>{" "}
            {project.done ? "Finished" : "Not finished"}
            <br />
            <strong>Project first date:</strong>{" "}
            {new Date(project.date_made).toLocaleDateString()}
            <br />
            <strong>Project finished date:</strong>{" "}
            {new Date(project.date_finish).toLocaleDateString()}
            <br />
            <strong>Pdf:</strong> {project.file_path}
            {project.file_path && (
              <a
                href={API_URL + "/uploads/" + project.file_path}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF
              </a>
            )}
            <p>
              <Link to={`/project/${project.id}`}>View project</Link>
            </p>
          </p>
        </div>
      ))}
    </div>
  </div>
);

}
