import express from "express";
import session from "express-session";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import projectsRouter from "./routes/projects.js";
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
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    },
  })
);

app.use(authRouter);
app.use(profileRouter);
app.use("/projects", projectsRouter);

app.listen(8080,() => {
    console.log("Running on port",8080);
});

