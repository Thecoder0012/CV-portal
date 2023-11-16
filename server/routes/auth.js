import { Router } from "express";
import db from "../db/connection.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const [getUser] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    const user = getUser[0];

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        req.session.user = user;
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", (req, res) => {
  const auth = !!req.session.user;
  res.status(200).send({ auth, user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send({ message: "you are logged out" });
});

export default router;
