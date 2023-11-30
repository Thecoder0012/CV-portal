import express from "express";
import session from "express-session";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import projectsRouter from "./routes/projects.js";
import {dirname, resolve} from 'path'
import cors from 'cors';
import "dotenv/config";
import { fileURLToPath } from "url";


const app = express();
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);
const parentDirectory = resolve(__dirname, '../client/public');



app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: true
  })
);

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
app.use(express.static(parentDirectory));


app.listen(8080,() => {
    console.log("Running on port",8080);
});

