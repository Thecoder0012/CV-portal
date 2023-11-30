import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/singleProject.module.css";
import { API_URL } from "../config/apiUrl.js";
import { response } from "express";

export const SingleProject = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [project, setProject] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/projects/getProject/${path}`
        );
        setProject(response.data);
        setTitle(response.data.title);
        setDesc(response.data.description);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    getProject();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/projects/deleteProject/${path}`);
      window.location.replace("/");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/projects/updateProject/${path}`, {
        title: title,
        description: desc,
      });
      setUpdateMode(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className={styles.SingleProject}>
      <div className={styles.singleProjectWrapper}>
        {project.photo && (
          <img src={project.photo} alt="" className={styles.singleProjectImg} />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className={styles.singleProjectTitleInput}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className={styles.singleProjectTitle}>
            {title}
          </h1>
        )}
        <div className={styles.singleProjectInfo}>
          <span className={styles.singleProjectAuthor}>
            Author:
            <Link to={`/?user=${project.username}`} className={styles.link}>
              <b> {project.username}</b>
            </Link>
          </span>

          <span className={styles.singleProjectDate}>
            {new Date(Date.parse(project.createdAt)).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className={styles.singleProjectDescInput}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className={styles.singleProjectDesc}>{desc}</p>
        )}
        {updateMode && (
          <button className={styles.singleProjectButton} onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
};
