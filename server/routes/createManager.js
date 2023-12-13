import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post("/registerManager", async (req, res) => {
  try {
    const manager = req.body;
    const [user] = await db.query("SELECT * from users ORDER BY user_id desc limit 1")
   const userid = user[0].user_id

   console.log("HER0")


    const [createPerson] = await db.query("INSERT INTO person (first_name, last_name, date_of_birth, phone_number) VALUES (?,?,?,?)", [manager.firstName, manager.lastName, manager.dateOfBirth, manager.Phone]);

    console.log("HER")


    const createManager = await db.query("INSERT INTO manager (person_id, user_id, department_id) VALUES (?,?,?)", [createPerson.insertId, userid, manager.department_id]);

    res.status(200).json({ message: "Manager registered successfully"});
  } catch (error) {
    console.error("Error registering manager:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
