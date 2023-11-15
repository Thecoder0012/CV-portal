import db from "../db/connection.js"
import express from "express"

const router = express.Router()

  router.post("/login", (req, res) => {
    const {username, password, email, role_id} = req.body;
    db.query("INSERT INTO users (username, email, password, role_id) VALUES (?,?,?,?)", [username, password, email, role_id]);

});

export default router

  


