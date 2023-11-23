import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post("/profile", async (req, res) => {
  console.log(req.session);
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      address_id,
      user_id,
      department_id,
      skills_id,
    } = req.body;

    const existingProfile = await db.query(
      "SELECT * FROM employee INNER JOIN person ON employee.person_id = person.person_id where person.first_name = ? AND person.last_name = ? AND person.date_of_birth = ? OR phone_number = ?",
      [first_name, last_name, date_of_birth,phone_number]
    );

    if (existingProfile[0].length > 0) {
      return res.status(409).send({
        message: "The employee exists already. Please change some of the fields",
      });
    } else {
      const createProfile = await db.query(
        "INSERT INTO person (first_name, last_name, date_of_birth, phone_number, address_id) VALUES (?,?,?,?,?)",
        [
          first_name,
          last_name,
          new Date(date_of_birth),
          phone_number,
          address_id,
        ]
      );
      const createEmployee = await db.query(
        "INSERT INTO employee (person_id, user_id, department_id, skills_id) VALUES (?,?,?,?)",
        [createProfile[0].insertId, user_id, department_id, skills_id]
      );

      return res
        .status(200)
        .send({ message: "The employee has been registered" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});
export default router;
