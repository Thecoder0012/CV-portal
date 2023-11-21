import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post("/profile", async (req, res) => {
    try {
      const { first_name, last_name, date_of_birth, phone_number, address_id } = req.body;
      const createProfile = await db.query(
        "INSERT INTO person (first_name, last_name, date_of_birth, phone_number, address_id) VALUES (?,?,?,?,?)",
        [first_name, last_name, new Date(date_of_birth), phone_number, address_id]
      );
      return res.status(200).send({message:"The person has been registered"});

    } catch (error) {
      return res.status(500).send({message:"Internal server error"});
    }
  });

  export default router;