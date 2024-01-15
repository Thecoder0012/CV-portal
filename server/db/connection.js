import mysql from "mysql2/promise";
import "dotenv/config";

const db = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createConnection() {
  const connection = await db.getConnection();
  try {
    console.log("Connection");
  } catch (error) {
    console.error("Could not connect to the database:", error);
  } finally {
    connection.release();
  }
}

async function createTable() {
  const connection = await db.getConnection();
  try {
    await connection.query(`
    CREATE TABLE IF NOT EXISTS address (
    address_id INT NOT NULL AUTO_INCREMENT,
    zip_code VARCHAR(4) NOT NULL,
    city VARCHAR(30) NOT NULL,
    PRIMARY KEY (address_id)
  )
`);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    country VARCHAR(255) DEFAULT NULL,
    address_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id) REFERENCES address (address_id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (role_id)
  )
`);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    role_id INT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS person (
    person_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) DEFAULT NULL,
    last_name VARCHAR(255) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    phone_number VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (person_id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS manager (
    id INT NOT NULL AUTO_INCREMENT,
    person_id INT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    department_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (person_id) REFERENCES person (person_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (department_id) REFERENCES department (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS employee (
    employee_id INT NOT NULL AUTO_INCREMENT,
    person_id INT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    department_id INT DEFAULT NULL,
    project_path_url VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (person_id) REFERENCES person (person_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (department_id) REFERENCES department (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS skills (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS project (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) DEFAULT NULL,
    description TEXT,
    done TINYINT(1) DEFAULT NULL,
    date_made DATE DEFAULT NULL,
    date_finish DATE DEFAULT NULL,
    file_path VARCHAR(255) DEFAULT NULL,
    manager_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (manager_id) REFERENCES manager (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS project_requests (
    request_id INT NOT NULL AUTO_INCREMENT,
    employee_id INT DEFAULT NULL,
    project_id INT DEFAULT NULL,
    status TINYINT(1) DEFAULT '0',
    PRIMARY KEY (request_id),
    FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    FOREIGN KEY (project_id) REFERENCES project (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS employee_skills (
    employee_id INT DEFAULT NULL,
    skills_id INT DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    FOREIGN KEY (skills_id) REFERENCES skills (id)
  )
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS employee_projects (
    employee_id INT DEFAULT NULL,
    project_id INT DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    FOREIGN KEY (project_id) REFERENCES project (id)
  )
`);
  } catch (error) {
    console.error("Could not create the tables.:", error);
  } finally {
    connection.release();
  }
}
createConnection();
createTable();
export default db;
