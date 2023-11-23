import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post("/profile", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      address_id,
      department_id,
      skills_id,
    } = req.body;

    const user_id = req.session.user.user_id;
    const [existingProfile] = await db.query(
      `SELECT * FROM employee 
       INNER JOIN person 
       ON employee.person_id = person.person_id 
       INNER JOIN users ON employee.user_id = users.user_id 
       WHERE users.user_id = ?
       OR person.phone_number = ?`,
      [user_id, phone_number]
    );

    if (existingProfile.length > 0) {
      const user_exists = existingProfile.some(
        (user) => user.user_id === user_id
      );

      if (user_exists) {
        return res.status(409).send({
          message: "You have already created your profile.",
        });
      }

      const phone_number_exists = existingProfile.some(
        (person) => person.phone_number === phone_number
      );

      if (phone_number_exists) {
        return res.status(409).send({ phone_state: false });
      }
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

router.get("/api/address", async (req, res) => {
  try {
    const [addresses] = await db.query("SELECT * FROM address");
    res.status(200).send({ addresses });
  } catch (error) {
    console.error("Error finding addresses:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
