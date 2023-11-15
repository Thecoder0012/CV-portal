import { Router } from "express";
import db from "../db/connection.js";
import bcrypt from "bcrypt";


const router = Router();


router.post("/signup", async (req,res) => {
const { username, email, password, roleId } = req.body;

const encryptedPass = await bcrypt.hash(password.toString(), 12);
const signUp = await db.query("INSERT into users (username,email,password,role_id) values (?,?,?,?)",
[username,password,email,roleId]);

res.status(200).send("You have signed up.")
});


export default router;