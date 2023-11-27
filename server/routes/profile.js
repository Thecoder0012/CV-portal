import { Router } from "express";
import db from "../db/connection.js";
import multer from 'multer';
import path from "path";



const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });


router.post("/profile", upload.single('file'), async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      department_id,
      skills
    } = req.body;
    let file_path = req.file.filename;

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
        "INSERT INTO person (first_name, last_name, date_of_birth, phone_number) VALUES (?,?,?,?)",
        [
          first_name,
          last_name,
          new Date(date_of_birth),
          phone_number
        ]
      );
      const createEmployee = await db.query(
        "INSERT INTO employee (person_id, user_id, department_id,project_path_url) VALUES (?,?,?,?)",
        [createProfile[0].insertId, user_id, department_id, file_path]
      );

       for (const skill_id of skills) {
         await db.query(
           "INSERT INTO employee_skills (employee_id, skills_id) VALUES (?,?)",
           [createEmployee[0].insertId, skill_id]
         );
       }

      return res
        .status(200)
        .send({ message: "The employee has been registered" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
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

export default router;
