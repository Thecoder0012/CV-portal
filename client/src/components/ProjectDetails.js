import React, { useState, useEffect } from "react";
 import { useLocation, Link } from "react-router-dom";
 import axios from "axios";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import styles from "../styles/projectDetails.module.css";
 import { API_URL } from "../config/apiUrl.js";
 import { useParams } from "react-router-dom";


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

   const { id } = useParams();

   const getProject = async () => {
     try {
       const response = await axios.get(API_URL + "/projects/" + id);
       setProject(response.data);
     } catch (error) {
       console.error("Error fetching project:", error);
     }
   };

   useEffect(() => {
     getProject();
   }, [id]);

      const handleDelete = async () => {
        try {
          await axios.delete(API_URL + "/projects/" + id);
        } catch (error) {
          console.error("Error deleting project:", error);
        }
      };

   //    const handleUpdate = async () => {
   //      try {
   //        await axios.put(`${API_URL}/projects/updateProject/${path}`, {
   //          project_title: title,
   //          project_description: desc,
   //        });
   //      } catch (error) {
   //        console.error("Error updating project:", error);
   //      }
   //    };

   return (
     <div className="singleProject">
       <div>
         <h1>{project.title}</h1>
         <p>Description: {project.description}</p>
         <p>Author: {project.author}</p>
         <p>Status: {project.done ? "Finished" : "Not finished"}</p>
         <p>Date Made: {new Date(project.date_made).toLocaleDateString()}</p>
         <p>
           Date Finish: {new Date(project.date_finish).toLocaleDateString()}
         </p>
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
       </div>

       {/* <div className="singleProjectWrapper">
         <img src={project.photo} alt="" className="singleProjectImg" />
         <input
           type="text"
           value={title}
           className="singleProjectTitleInput"
           autoFocus
           onChange={(e) => setTitle(e.target.value)}
         />
         <h1 className="singleProjectTitle">{title}</h1>
         <div className="singleProjectInfo">
           <span className="singleProjectAuthor">
             Author:
             <Link to={`/?user=${project.username}`} className="link">
               <b> {project.username}</b>
             </Link>
           </span>

           <span className="singleProjectDate">
             {new Date(Date.parse(project.createdAt)).toDateString()}
           </span>
         </div>
         <textarea
           className="singleProjectDescInput"
           value={desc}
           onChange={(e) => setDesc(e.target.value)}
         />
         <p className="singleProjectDesc">{desc}</p>
         <button className="singleProjectButton" onClick={handleUpdate}>
           Update
         </button>
       </div> */}
     </div>
   );
 }