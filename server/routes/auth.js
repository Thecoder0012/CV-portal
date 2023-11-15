import { Router } from "express";
import db from "../db/connection.js";
import bcrypt from "bcrypt";


const router = Router();




router.post("/signup", async (req,res) => {
const { username, password, email, roleId } = req.body;
const encryptedPass = await bcrypt.hash(password, 12);

const existingUser = await db.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username])
const [user] = existingUser[0]
if(!!user){
    return res.status(409).send("A account already exists with this email/username")
} else {
    const signUp = await db.query("INSERT into users (username,password,email,role_id) values (?,?,?,?)",
    [username,encryptedPass,email,roleId]);
    
   return res.status(200).send("You have now signed up")
}

});






export default router;