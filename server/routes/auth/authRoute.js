import { Router } from "express";
import db from "../../db/connection.js";
import bcrypt from "bcrypt";
import { rateLimit } from "express-rate-limit";

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(["/register", "/login"], apiLimiter);

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role_id } = req.body;
    const encryptedPass = await bcrypt.hash(password, 12);
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    const [user] = existingUser[0];

    if (user) {
      return res.status(409).send({
        message: "An account already exists with this email/username",
      });
    } else {
      const signUp = await db.query(
        "INSERT into users (username,password,email,role_id) values (?,?,?,?)",
        [username, encryptedPass, email, role_id]
      );
      return res.status(200).send({ message: "You have now signed up" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

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
        res.status(200).send({ message: "Login successful" });
      } else {
        res.status(401).send({ message: "Invalid password" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/auth-login", (req, res) => {
  const auth = !!req.session.user;
  res.status(200).send({ auth, user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send({ message: "Successfully signed out" });
});

export default router;
