import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "../styles/projectDetails.module.css";
import { API_URL } from "../config/apiUrl.js";
import { NavigationBar } from "./NavigationBar.js";
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
  const [request, setRequest] = useState(false);
  const [role_id, setRoleId] = useState();

  const WITH_CREDENTIALS = { withCredentials: true };
  const { id } = useParams();

  const getProject = async () => {
    try {
      const response = await axios.get(API_URL + "/projects/" + id, WITH_CREDENTIALS);
      setProject(response.data.getProject);
      setRoleId(response.data.role_id)
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        toast.error(error.response.data);
      }
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
        setRequest(response.data.request);
      }
    } catch (error) {
      console.error("Error assigning project:", error);
    }
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <div>
      <NavigationBar />
      <ToastContainer
        autoClose={15000}
        closeOnClick={true}
        position={toast.POSITION.TOP_CENTER}
        limit={2}
      />
      <div className={styles.singleProject}>
        <h1 className={styles.projectTitle}>{project.title}</h1>
        <div className={styles.projectDetails}>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Author:</strong> {project.first_name}
          </p>
          <p>
            <strong>Status:</strong>
            {project.done ? "Finished" : "Not finished"}
          </p>
          <p>
            <strong>Date Made:</strong>
            {new Date(project.date_made).toLocaleDateString()}
          </p>
          <p>
            <strong>Date Finish:</strong>
            {new Date(project.date_finish).toLocaleDateString()}
          </p>
          <p>
            <strong>Pdf:</strong> {project.file_path}
          </p>
          {project.file_path && (
            <a
              href={API_URL + "/uploads/" + project.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewPdfLink}
            >
              View Project PDF
            </a>
          )}
          {role_id === 2 && (
            <button
              className={styles.requestButton}
              onClick={requestProject}
              disabled={request}
            >
              Assign me
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
