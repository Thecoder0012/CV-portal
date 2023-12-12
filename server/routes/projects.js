import transporter from "../mail/mailConfig.js";
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

const isManager = (req, res, next) => {
  if (req.session.user && req.session.user.role_id === 1) {
    next();
  } else {
    res
      .status(403)
      .send({ message: "Forbidden route! You are not authorized" });
  }
};

router.post("/project-assignment", async (req, res) => {
  try {
    const user_id = req.session.user.user_id;
    const [manager] = await db.query(
      `SELECT first_name,last_name,email
       FROM users
       INNER JOIN manager ON users.user_id = manager.user_id
       INNER JOIN person ON manager.person_id = person.person_id
       WHERE manager.user_id = ?;`,
      [user_id]
    );

    const { project_id, employee_id } = req.body;

    if (!project_id || !employee_id) {
      return res
        .status(404)
        .send({ message: "Project and Employee are not found" });
    }

    const result = await db.query(
      `
      INSERT INTO employee_projects (project_id, employee_id)
      VALUES (?, ?)
      `,
      [project_id, employee_id]
    );

    const [project] = await db.query("SELECT * FROM project WHERE id = ?", [
      project_id,
    ]);

    if (!project || project.length === 0) {
      return res.status(404).send({ message: "Project not found" });
    }

    const [employee] = await db.query(
      `
     SELECT * from employee
        INNER JOIN person
        on employee.person_id = person.person_id
        INNER JOIN users
        on employee.user_id = users.user_id
        WHERE employee_id = ?`,
      [employee_id]
    );

    const employee_name = employee[0].first_name + " " + employee[0].last_name;
    const employee_email = employee[0].email;

    const manager_name = manager[0].first_name + " " + manager[0].last_name;
    const manager_email = manager[0].email;

    const mailInfo = transporter.sendMail(
      {
        from: manager_email,
        to: employee_email,
        subject: "Project assignment to " + employee_name,
        text: `Hello ${employee_name}! Project ${employee[0].title} is now assigned to you.\n \n
        Best regards \n
        Team Manager:
        ${manager_name}`,
      },
      (error, info) => {
        if (error) {
          console.error(error);
        } else {
          res
            .status(200)
            .send({ message: "You have successfully sent a message!" });
        }
      }
    );

    res.status(200).send({ message: "Project assigned successfully" });
  } catch (error) {
    console.error("Error assigning project:", error);
    res.status(500).send({ message: "Error assigning project" });
  }
});

router.delete(
  "/project-assignment/:employee_id/:project_id",
  async (req, res) => {
    const employee_id = req.params.employee_id;
    const project_id = req.params.project_id;
    try {
      const deleteEmployeeProject = await db.query(
        "DELETE FROM employee_projects WHERE employee_id = ? AND project_id = ?",
        [employee_id, project_id]
      );
      res
        .status(200)
        .send({ message: "Employee removed from project successfully" });
    } catch (error) {
      console.error("Error removing employee from project:", error);
      res.status(500).send({ message: error.message });
    }
  }
);

router.get("/assigned-projects", async (req, res) => {
  const user_id = req.session.user.user_id;

  const [employee] = await db.query(
    `
  SELECT * from employee
  INNER join users ON employee.user_id = users.user_id
  WHERE employee.user_id = ?;`,
    [user_id]
  );

  const employee_id = employee[0].employee_id;
  const [assignedProjects] = await db.query(
    `
  Select * from employee
  INNER join employee_projects 
  ON employee.employee_id = employee_projects.employee_id
  where employee.employee_id = ?;`,
    [employee_id]
  );

  res.status(200).send(assignedProjects);
});

router.post("/projects", upload.single("file"), async (req, res) => {
  try {
    const { title, description, date_finish, manager_id } = req.body;
    const projectFile = req.file ? req.file.filename : null;

    let [projectCount] = await db.query(
      "SELECT COUNT(*) as count FROM project"
    );
    projectCount = projectCount[0].count;

    if (projectCount >= 20) {
      return res.status(400).send({
        message: "Project limit reached.",
      });
    }

    const createProjectQuery = `
        INSERT INTO project (title, description, done, date_made, date_finish, file_path,manager_id)
        VALUES (?, ?, false, CURDATE(), ?, ?,?)
    `;

    const result = await db.query(createProjectQuery, [
      title,
      description,
      date_finish,
      projectFile,
      manager_id,
    ]);

    res.status(200).send({ message: "Project succesfully created" });
  } catch (error) {
    console.error("Error while creating the project:", error);
    res.status(500).send({ message: "Error while creating the project" });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const project_id = req.params.id;
    const role_id = req.session.user.role_id;
    const [project] = await db.query(
      `SELECT project.id AS project_id, project.*, manager.*, person.*
       FROM project
       INNER JOIN manager ON project.manager_id = manager.id
       INNER JOIN person ON manager.person_id = person.person_id
       WHERE project.id = ?`,
      [project_id]
    );

    if (!project) {
      return res.status(404).send("Sorry, Project not found");
    }

    const getProject = project[0];
    res.status(200).json({ getProject, role_id });
  } catch (error) {
    console.error("Error while fetching the project:", error);
    res.status(500).send({ message: "Error while fetching the project" });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, done, date_finish } = req.body;

    const updateProjectQuery = `
        UPDATE project 
        SET title = ?, 
            description = ?, 
            done = ?,
            date_finish = ?
        WHERE id = ?
    `;

    await db.query(updateProjectQuery, [
      title,
      description,
      done,
      date_finish,
      projectId,
    ]);

    res.status(200).send("Project updated successfully");
  } catch (error) {
    console.error("Error while updating project:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    const deleteEmployeeProject = await db.query(
      "UPDATE employee_projects SET project_id = NULL WHERE project_id = ?",
      [projectId]
    );

    const deleteProjectQuery = "DELETE FROM project WHERE id = ?";
    await db.query(deleteProjectQuery, [projectId]);

    res.status(200).send("Project deleted successfully");
  } catch (error) {
    console.error("Error deleting the project:", error);
    res.status(500).send(`Error deleting the project: ${error.message}`);
  }
});

router.get("/api/managers", async (req, res) => {
  try {
    const [managers] = await db.query(`
    SELECT person.first_name, person.last_name,manager.id
    FROM users
    INNER JOIN manager ON users.user_id = manager.user_id
    INNER JOIN person ON manager.person_id = person.person_id`);

    res.status(200).send({ managers });
  } catch (error) {
    console.error("Error finding managers:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/request-project", async (req, res) => {
  const user_id = req.session.user.user_id;
  const project_id = req.body.project_id;

  const [employee] = await db.query(
    `
    SELECT person.first_name, person.last_name,email
    FROM users
    INNER JOIN employee ON users.user_id = employee.user_id
    INNER JOIN person ON employee.person_id = person.person_id
    WHERE users.user_id = ?`,
    [user_id]
  );

  const [project] = await db.query(`SELECT * from project WHERE id = ?`, [
    project_id,
  ]);

  const [manager] = await db.query(
    `
    SELECT * from project
    INNER JOIN manager ON project.manager_id = manager.id
    INNER JOIN person ON manager.person_id = person.person_id
    INNER JOIN users ON manager.user_id = users.user_id
    where project.id = ?;`,
    [project_id]
  );

  const employee_name = employee[0].first_name + " " + employee[0].last_name;
  const employee_email = employee[0].email;

  const manager_name = manager[0].first_name + " " + manager[0].last_name;
  const manager_email = manager[0].email;

  const mailInfo = transporter.sendMail(
    {
      from: employee_email,
      to: manager_email,
      subject: "Project Request assignment from: " + employee_name,
      text: `Hello ${manager_name} \n\n I want to be assigned to project: ${project[0].title}.\n \n
        Best regards \n
        Employee:
        ${employee_name}`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({
          message: "You have successfully sent a message!",
        });
      }
    }
  );

  return res
    .status(200)
    .send({ message: "Your request has been sent!", request: true });
});

export default router;
