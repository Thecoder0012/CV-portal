import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/UpdateProjectPopup.module.css";
import Swal from "sweetalert2";
import { API_URL } from "../config/apiUrl.js";
import {useNavigate, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";



const WITH_CREDENTIALS = { withCredentials: true };

const UpdateProjectPopup = ({ projectId, onClose, onUpdate }) => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    done: false,
    date_finish: "",
  });

  console.log(projectData);


  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };


  
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (project_id) => {
    const loadingAlert = Swal.fire({
      title: "Please wait...",
      text: "You are being redirected back to the project list.",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const isConfirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#a100ff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (isConfirmed.isConfirmed) {
        const response = await axios.delete(
          API_URL + "/projects/" + project_id,
          WITH_CREDENTIALS
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "The project was successfully deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            loadingAlert.close();
            navigate(location.state ? location.state.from : "/manager/projects");
          });
        } else {
          loadingAlert.close();
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      loadingAlert.close();
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(API_URL + `/projects/${projectId}`,WITH_CREDENTIALS);
        const project = response.data.getProject;
        setProjectData({
          title: project.title,
          description: project.description,
          done: project.done,
          date_finish: project.date_finish,
          file: null,
        });
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProjectData({
      ...projectData,
      file: file,
    });
  };

  const handleUpdate = async () => {

projectData.date_finish = formatDate(projectData.date_finish)

    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}`, projectData, WITH_CREDENTIALS);


      if (response.status === 200) {
        Swal.fire({
          title: "Updated!",
          text: "The project was successfully updated.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
      <div id="form" style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Update Project</h2>
        <label>Title</label>
        <input
          className={styles.input}
          type="text"
          name="title"
          id="title"
          value={projectData.title}
          onChange={handleInputChange}
        />
        <label>Description</label>
        <textarea 
          name="description"
          id="description"
          value={projectData.description}
          onChange={handleInputChange}
          className={styles.descriptionContainer}
        />
        <label>Status</label>
        <select
          name="done"
          id="projectStatus"
          value={projectData.done}
          onChange={handleInputChange}
        >
          <option value={1}>Completed</option>
          <option value={0}>Active</option>
        </select>
        <label>End date</label>
        <input
          className={styles.input}
          type="date"
          name="date_finish"
          id="endDate"
          value={formatDate(projectData.date_finish)}
          onChange={handleInputChange}
        />
        </div>
        <div className={styles.buttons}>
          <div>
            <FaCheck
              className={styles.updateBtn}
              onClick={() => {
                handleUpdate(projectId);
              }}
              size={25}
            ></FaCheck>
          </div>
          <div>
            <MdDelete
              className={styles.deleteBtn}
              onClick={() => {
                handleDelete(projectId);
              }}
              size={25}
            />
          </div>
          
            <button onClick={onClose} className={styles.closeButton}>
              <FaTimes size={20}/>
            </button>
          
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectPopup;
