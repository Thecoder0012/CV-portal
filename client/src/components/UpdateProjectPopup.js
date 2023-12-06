import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/UpdateProjectPopup.module.css";

const UpdateProjectPopup = ({ projectId, onClose, onUpdate }) => {
  const [projectData, setProjectData] = useState({
    project_title: "",
    project_description: "",
    project_done: false,
    date_finish: "",
    projectFile: null,
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        const project = response.data;
        setProjectData({
          project_title: project.title,
          project_description: project.description,
          project_done: project.done,
          date_finish: project.date_finish,
          projectFile: null,
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
      projectFile: file,
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("project_title", projectData.project_title);
      formData.append("project_description", projectData.project_description);
      formData.append("project_done", projectData.project_done);
      formData.append("date_finish", projectData.date_finish);
      formData.append("projectFile", projectData.projectFile);

      await axios.put(`/api/projects/${projectId}`, formData);

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2>Update Project</h2>
        <label>Title:</label>
        <input
          type="text"
          name="project_title"
          value={projectData.project_title}
          onChange={handleInputChange}
        />
        <label>Description:</label>
        <textarea
          name="project_description"
          value={projectData.project_description}
          onChange={handleInputChange}
        />
        <label>Status:</label>
        <select
          name="project_done"
          value={projectData.project_done}
          onChange={handleInputChange}
        >
          <option value={false}>Not finished</option>
          <option value={true}>Finished</option>
        </select>
        <label>Finish Date:</label>
        <input
          type="date"
          name="date_finish"
          value={projectData.date_finish}
          onChange={handleInputChange}
        />
        <label>Upload PDF:</label>
        <input
          type="file"
          name="projectFile"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UpdateProjectPopup;
