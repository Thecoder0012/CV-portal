import db from "../db/connection.js";
import request from "supertest"; 
import { app } from "../server.js";

describe("POST /register", () => {
  it("should register a new user", async () => {
    const newUser = {
      username: "testtest0",
      password: "testtest0",
      email: "testtest000@example.com",
      role_id: 1,
    };
    const response = await request(app).post("/register").send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("You have now signed up");

    const [insertedUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [newUser.username]
    );
    expect(insertedUser.length).toBe(1);
  });
});
