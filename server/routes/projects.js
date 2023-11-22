import multer from "multer";
import path from "path";
import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "uploads/");
  },
  filename: function (req, file, callBack) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callBack(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/createProject",
  upload.single("projectFile"),
  async (req, res) => {
    try {
      const { project_title, project_description, project_author, manager_id } =
        req.body;
      const projectFile = req.file;

      const [manager] = await db.query(
        "SELECT * FROM manager WHERE manager_id = ?",
        [manager_id]
      );
      if (!manager) {
        return res
          .status(403)
          .send("Sorry, You have no right to create a project");
      }

      const createProjectQuery = `
        INSERT INTO project (project_title, project_description, project_author, project_done, date_made, date_finish, project_file_path)
        VALUES (?, ?, ?, false, CURDATE(), null, ?)
        `;

      const result = await db.query(createProjectQuery, [
        project_title,
        project_description,
        project_author,
        projectFile ? projectFile.path : null,
      ]);

      res.status(201).send("Project succesfully created");
    } catch (error) {
      console.error("Error while creating the project:", error);
      res.status(500).send("Error while creating the project");
    }
  }
);

router.get("/getProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    const [project] = await db.query(
      "SELECT * FROM project WHERE project_id = ?",
      [projectId]
    );

    if (!project) {
      return res.status(404).send("Sorry, Project not found");
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error while fetching project:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put(
  "/updateProject/:id",
  upload.single("projectFile"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const { project_title, project_description, project_done, date_finish } =
        req.body;
      const projectFile = req.file;

      const updateProjectQuery = `
            UPDATE project 
            SET project_title = ?, 
                project_description = ?, 
                project_file_path = ?,
                project_done = ?,
                date_finish = ?
            WHERE project_id = ?
        `;

      await db.query(updateProjectQuery, [
        project_title,
        project_description,
        projectFile ? projectFile.path : null,
        project_done,
        date_finish,
        projectId,
      ]);

      res.status(200).send("Project updated successfully");
    } catch (error) {
      console.error("Error while updating project:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.delete("/deleteProject/:project_id", async (req, res) => {
  try {
    const projectId = req.params.project_id;

    const deleteProjectQuery = `
        DELETE FROM project WHERE project_id = ?
        `;

    await db.query(deleteProjectQuery, [projectId]);

    res.status(200).send("Project deleted successfully");
  } catch (error) {
    console.error("Error deleting the project:", error);
    res.status(500).send("Error deleting the project");
  }
});

export default router;
