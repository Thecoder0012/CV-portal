import mysql from "mysql2/promise";
import "dotenv/config";


const db = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function createConnection() {
    const connection = await db.getConnection();
    try {
        console.log("Connection")
    } catch (error) {
      console.error("Could not connect.:", error);
    } finally {
      connection.release();
    }
  }
  createConnection();
  export default db;