import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post("/profile", async (req, res) => {
    try {
      const { first_name, last_name, date_of_birth, phone_number } = req.body;
      console.log("REQ", req.body)

      const createProfile = await db.query(
        "INSERT INTO person (first_name, last_name, date_of_birth, phone_number) VALUES (?,?,?,?)",
        [first_name, last_name, new Date(date_of_birth), phone_number ]
      );
      console.log("REQ", req.body)
      return res.status(200).send({message:"The person has been registered"});

    } catch (error) {
      console.log(error)
      return res.status(500).send({message:"Internal server error"});
    }
  });



router.put("/profile", async (req, res) => {
  const userId = req.session.user.user_id
    try {
      const {first_name, last_name, date_of_birth, phone_number, department_id, skills } = req.body
      const person_id = userId
     

      if (!person_id) {
          return res.status(400).send({ message: "Person ID is required for updating a profile." });
      }

      const updateProfile = await db.query(
          "UPDATE person SET first_name=?, last_name=?, date_of_birth=?, phone_number=? WHERE person_id=?",
          [first_name, last_name, date_of_birth, phone_number, person_id]
      );

      const updateEmployee = await db.query(
        "UPDATE employee SET department_id=? WHERE employee_id=?",
        [department_id, person_id]
      )


      const deleteSkills = await db.query("DELETE FROM employee_skills WHERE employee_id = ?",
      [person_id])

      for (const skill of skills) { 
        await db.query("INSERT INTO employee_skills (employee_id, skills_id) VALUES (?,?)", [person_id, skill])
        
        }
      if (updateProfile[0].affectedRows > 0 && updateEmployee[0].affectedRows > 0) {
          return res.status(200).send({ message: "The person's profile has been updated." });
      } else {
          return res.status(404).send({ message: "Person not found or no changes were made." });
      }


  } catch (error) {
      console.error(error);
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

router.get("/profile", async (req, res) => {


  const userId = req.session.user.user_id
  

    const fetchProfile = await db.query(`SELECT *
      FROM users
      INNER JOIN employee ON users.user_id = employee.user_id
      INNER JOIN person ON users.user_id = person.person_id
      WHERE employee.user_id = ?;`
      , [userId]);

      const fetchProfileSkills = await db.query(`SELECT *
      FROM employee_skills
      WHERE employee_id = ?`, [userId])

      const result = fetchProfileSkills[0]

      const skillsIdsArray = result.map((row) => row.skills_id);

      const profile = {
        ...fetchProfile[0],
        skills: skillsIdsArray,
      };


  if(profile){
    return res.status(200).send(profile)
  }
  
  else {
    return res.status(409).send("Der opstod en fejl")
  }
  })

  export default router;