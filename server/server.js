import express from "express";
import session from "express-session";
import authRoute from "./routes/auth/authRoute.js";
import profileRoute from "./routes/profile/profileRoute.js";
import projectsRoute from "./routes/project/projectRoute.js";
import apiRoute from "./routes/api/apiRoute.js";
import cors from 'cors';
import path from "path";
import "dotenv/config";

const app = express();
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: true
  })
);

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000,
      httpOnly: true
    },
  })
);

app.use(apiRoute)
app.use(authRoute);
app.use(profileRoute);
app.use(projectsRoute);

app.listen(8080,() => {
    console.log("Running on port",8080);
});