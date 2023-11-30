import nodemailer from 'nodemailer';
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

// TODO SMTP Skal oprettes før det virker:
const transporter = nodemailer.createTransport({
  host: 'your-smtp-host',
  port: 587,
  secure: false, 
  auth: {
    user: 'your-smtp-username',
    pass: 'your-smtp-password',
  },
});

const sendNotification = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'your-sender-email@example.com',
      to,
      subject,
      text,
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Den her virker. Hvor man kan assigne et projekt til en employee. Problemet er, at det kun skal være en manager der skal kunne gøre det
// UDEN Auth

/*router.post('/assignProject', async (req, res) => {
  try {
    const { projectId, employeeId } = req.body;


    const [project] = await db.query(
      'SELECT * FROM project WHERE id = ?',
      [projectId]
    );

    
    const updateEmployeeProjectPathQuery = `
      UPDATE employee
      SET project_id = ?
      WHERE employee_id = ?
    `;
  
    const result = await db.query(updateEmployeeProjectPathQuery, [
      projectId,
      employeeId
    ]);

    //Hent medarbejderens e-mail for at sende meddelelse
    const [employee] = await db.query(
      'SELECT users.email FROM employee JOIN users ON employee.user_id = users.user_id WHERE employee_id = ?',
      [employeeId]
    );

    // Send notifikation
    const notificationText = `You have been assigned a new project. Check your dashboard for details.`;
    await sendNotification(employee[0].email, 'New Project Assignment', notificationText);

    res.status(201).send('Project assigned successfully');
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).send('Error assigning project');
  }
});*/



// MED Aut - Men kan ikke få det til at virke i postman.
router.post('/assignProject', async (req, res) => {
  try {
    const { projectId, employeeId } = req.body;

    const managerId = req.session.user?.manager_id;

    if (!managerId) {
      return res.status(403).send("Sorry, you do not have the permission to assign a project");
    }

    const [manager] = await db.query(
      'SELECT * FROM manager WHERE manager_id = ?',
      [managerId]
    );

    if (!manager || manager.length === 0) {
      return res.status(403).send("Sorry, you do not have the permission to assign a project");
    }

    const [project] = await db.query(
      'SELECT * FROM project WHERE id = ?',
      [projectId]
    );

    if (!project || project.length === 0) {
      return res.status(404).send("Project not found");
    }

    const updateEmployeeProjectPathQuery = `
      UPDATE employee
      SET project_id = ?
      WHERE employee_id = ?
    `;
  
    const result = await db.query(updateEmployeeProjectPathQuery, [
      projectId,
      employeeId
    ]);


    const [employee] = await db.query(
      'SELECT users.email FROM employee JOIN users ON employee.user_id = users.user_id WHERE employee_id = ?',
      [employeeId]
    );

    const notificationText = `You have been assigned a new project. Check your dashboard for details.`;
    await sendNotification(employee[0].email, 'New Project Assignment', notificationText);

    res.status(201).send('Project assigned successfully');
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).send('Error assigning project');
  }
});




router.post(
  "/createProject",
  upload.single("projectFile"),
  async (req, res) => {
    try {
      const { title, description, author, manager_id } =
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
        INSERT INTO project (title, description, author, done, date_made, date_finish, file_path)
        VALUES (?, ?, ?, false, CURDATE(), null, ?)
        `;

      const result = await db.query(createProjectQuery, [
        title,
        description,
        author,
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
      const { title, description, done, date_finish } =
        req.body;
      const projectFile = req.file;

      const updateProjectQuery = `
            UPDATE project 
            SET title = ?, 
                description = ?, 
                file_path = ?,
                done = ?,
                date_finish = ?
            WHERE project_id = ?
        `;

      await db.query(updateProjectQuery, [
        title,
        description,
        projectFile ? projectFile.path : null,
        done,
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