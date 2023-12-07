import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

router.post('/createManager', async (req, res) => {
  try {
    const { personId, userId, departmentId } = req.body;

    const createManagerQuery = `
      INSERT INTO manager (person_id, user_id, department_id, project_id)
      VALUES (?, ?, ?, null)
    `;

    const [managerResult] = await db.query(createManagerQuery, [personId, userId, departmentId]);

    const managerId = managerResult.insertId;

    res.status(201).json({ managerId });
  } catch (error) {
    console.error('Fejl under oprettelse af manager:', error);
    res.status(500).send('Fejl under oprettelse af manager');
  }
});

export default router;
