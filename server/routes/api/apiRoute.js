import { Router } from "express";
import db from "../../db/connection.js";

const router = Router();

router.get("/api/person", async (req, res) => {
  try {
    const [person] = await db.query("SELECT * FROM person");
    res.status(200).send({ person });
  } catch (error) {
    console.error("Error finding person:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/departments", async (req, res) => {
  try {
    const [departments] = await db.query("SELECT * FROM department");
    res.status(200).send({ departments });
  } catch (error) {
    console.error("Error finding departments:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/skills", async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills");
    res.status(200).send({ skills });
  } catch (error) {
    console.error("Error finding skills:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/employees", async (req, res) => {
  try {
    const [employees] = await db.query("SELECT * FROM employee");
    res.status(200).send({ employees });
  } catch (error) {
    console.error("Error finding employee:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/employee-skills", async (req, res) => {
  try {
    const [employeeSkills] = await db.query("SELECT * FROM employee_skills");
    res.status(200).send({ employeeSkills });
  } catch (error) {
    console.error("Error finding employeeSkills:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/address", async (req, res) => {
  try {
    const [addresses] = await db.query("SELECT * FROM address");
    res.status(200).send({ addresses });
  } catch (error) {
    console.error("Error finding addresses:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/projects", async (req, res) => {
  try {
    const [projects] = await db.query(
      "SELECT * FROM project WHERE done = 0 LIMIT 20"
    );
    res.status(200).send({ projects });
  } catch (error) {
    console.error("Error finding projects:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/all-projects", async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM project");
    res.status(200).send({ projects });
  } catch (error) {
    console.error("Error finding projects:", error);
    res.status(500).send({ error: "Internal server error" });
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

router.get("/api/person-skills", async (req, res) => {
  try {
    const [employees] = await db.query(`
    SELECT
    employee.employee_id,
    person.first_name,
    person.last_name,
    GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills,
    GROUP_CONCAT(DISTINCT employee_projects.project_id SEPARATOR ',') AS projects
    FROM
    person
    INNER JOIN employee ON person.person_id = employee.person_id
    INNER JOIN employee_skills ON employee.employee_id = employee_skills.employee_id
    INNER JOIN skills ON employee_skills.skills_id = skills.id
    LEFT JOIN employee_projects ON employee.employee_id = employee_projects.employee_id
    LEFT JOIN project ON employee_projects.project_id = project.id
    GROUP BY
    person.person_id, employee.employee_id;`);

    res.status(200).send({ employees });
  } catch (error) {
    console.error("Error finding employees:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/requested-projects", async (req, res) => {
  try {
    const [requestedProjects] = await db.query(`
    SELECT * from project_requests 
    INNER JOIN employee on employee.employee_id = project_requests.employee_id
    INNER JOIN person on employee.person_id = person.person_id
    INNER JOIN project on project.id = project_requests.project_id
    WHERE project_requests.status = 1;`);
    res.status(200).send({ requestedProjects });
  } catch (error) {
    console.error("Error finding requested projects:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
