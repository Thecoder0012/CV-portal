import { Router } from "express";
import db from "../../db/connection.js";
import multer from "multer";
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

router.get("/profile", async (req, res) => {
  const userId = req.session.user.user_id;

  if (req.session.user.role_id === 1) {
    const [managerProfile] = await db.query(
      `SELECT *
       FROM users
       INNER JOIN manager ON users.user_id = manager.user_id
       INNER JOIN person ON manager.person_id = person.person_id
       WHERE manager.user_id = ?;`,
      [userId]
    );
    return res.status(200).send(managerProfile);
  } else if (req.session.user.role_id === 2) {
    try {
      const [fetchProfile] = await db.query(
        `SELECT *
         FROM users
         INNER JOIN employee ON users.user_id = employee.user_id
         INNER JOIN person ON employee.person_id = person.person_id
         WHERE employee.user_id = ?;`,
        [userId]
      );

      return res.status(200).send(fetchProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});

router.get("/profile/:id", async (req, res) => {
  const personid = req.params.id;

  if (!req.session.user || req.session.user.role_id === 2) {
    const [fetchProfile] = await db.query(
      `SELECT * FROM person
    INNER JOIN employee ON person.person_id = employee.person_id
    WHERE employee.person_id = ?;`,
      [personid]
    );

    const employee_id = fetchProfile[0].employee_id;
    const [fetchProfileSkills] = await db.query(
      `SELECT *
      FROM employee_skills
      WHERE employee_id = ?`,
      [employee_id]
    );

    const skillsIdsArray = fetchProfileSkills.map((row) => row.skills_id);

    const profile = {
      ...fetchProfile,
      skills: skillsIdsArray,
    };

    if (profile) {
      return res.status(200).send(profile);
    } else {
      return res.status(409).send("Der opstod en fejl");
    }
  }

  if (req.session.user.role_id === 1) {
    const [managerProfile] = await db.query(
      `SELECT *
       FROM users
       INNER JOIN manager ON users.user_id = manager.user_id
       INNER JOIN person ON manager.person_id = person.person_id
       WHERE manager.person_id = ?;`,
      [personid]
    );
    return res.status(200).send(managerProfile);
  }
});

router.post("/profile", upload.single("file"), async (req, res) => {

  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      department_id,
      skills,
    } = req.body;
    let file_path = req.file.filename;

    console.log("TEST2")
console.log("test3")
console.log("USERID")
    const user_id = req.session.user.user_id;
    console.log("USERID")
    console.log(user_id)
    const [existingProfile] = await db.query(
      `SELECT * FROM employee 
       INNER JOIN person 
       ON employee.person_id = person.person_id 
       INNER JOIN users ON employee.user_id = users.user_id 
       WHERE users.user_id = ?
       OR person.phone_number = ?`,
      [user_id, phone_number]
    );

    console.log("test3")

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
        [first_name, last_name, new Date(date_of_birth), phone_number]
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
        .send({ message: `Your profile was created, ${first_name} ${last_name} ` });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/profile/employee/:id", async (req, res) => {
  const person_id = req.params.id;
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      department_id,
      skills,
    } = req.body;

    const [fetchProfile] = await db.query(
      `SELECT *
      FROM users
      INNER JOIN employee ON users.user_id = employee.user_id
      INNER JOIN person ON employee.person_id = person.person_id
      WHERE employee.person_id = ?;`,
      [person_id]
    );

    const employee_id = fetchProfile[0].employee_id;

    if (!person_id) {
      return res
        .status(400)
        .send({ message: "Person ID is required for updating a profile." });
    }

    const updateProfile = await db.query(
      "UPDATE person SET first_name=?, last_name=?, date_of_birth=?, phone_number=? WHERE person_id=?",
      [first_name, last_name, date_of_birth, phone_number, person_id]
    );

    const updateEmployee = await db.query(
      "UPDATE employee SET department_id=? WHERE employee_id=?",
      [department_id, employee_id]
    );

    if (skills && skills.length > 0) {
      const deleteSkills = await db.query(
        "DELETE FROM employee_skills WHERE employee_id = ?",
        [employee_id]
      );

      for (const skill_id of skills) {
        await db.query(
          "INSERT INTO employee_skills (employee_id, skills_id) VALUES (?,?)",
          [employee_id, skill_id]
        );
      }
    }
    if (
      updateProfile[0].affectedRows > 0 &&
      updateEmployee[0].affectedRows > 0
    ) {
      return res
        .status(200)
        .send({ message: "The person's profile has been updated." });
    } else {
      return res
        .status(404)
        .send({ message: "Person not found or no changes were made." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/profile/manager/:id", async (req, res) => {
  const person_id = req.params.id;

  const { first_name, last_name, date_of_birth, phone_number } = req.body;

  const [updateManager] = await db.query(
    "UPDATE person SET first_name=?, last_name=?, date_of_birth=?, phone_number=? WHERE person_id=?",
    [first_name, last_name, date_of_birth, phone_number, person_id]
  );

  return res.status(200).send({ message: "Your profile was updated" });
});


router.post("/manager", async (req, res) => {
  try {
    const manager = req.body;
    const [user] = await db.query(
      "SELECT * from users ORDER BY user_id desc limit 1"
    );
    const userid = user[0].user_id;

    const [createPerson] = await db.query(
      "INSERT INTO person (first_name, last_name, date_of_birth, phone_number) VALUES (?,?,?,?)",
      [manager.firstName, manager.lastName, manager.dateOfBirth, manager.Phone]
    );

    const createManager = await db.query(
      "INSERT INTO manager (person_id, user_id, department_id) VALUES (?,?,?)",
      [createPerson.insertId, userid, manager.department_id]
    );

    res.status(200).json({ message: "Manager registered successfully" });
  } catch (error) {
    console.error("Error registering manager:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export default router;
