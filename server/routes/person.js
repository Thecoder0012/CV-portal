import { Router } from "express";
import db from "../db/connection.js";


const router = Router();


router.post("/registerPerson", async (req, res) => {
    try {
      const { first_name, last_name, date_of_birth, phone_number, address_id } = req.body;
      const registerPerson = await db.query(
        "INSERT INTO person (first_name, last_name, date_of_birth, phone_number, address_id) VALUES (?,?,?,?,?)",
        [first_name, last_name, new Date(date_of_birth), phone_number, address_id]
      );
   
      return res.status(200).send("The person has been registered");

    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  });

  export default router;