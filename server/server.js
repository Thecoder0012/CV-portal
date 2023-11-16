import express from "express";
import session from "express-session";
import routerAuth from "./routes/auth.js";
import routerPerson from "./routes/person.js";
import cors from 'cors';
import "dotenv/config";

const app = express();
app.use(express.json())
app.use(cors());

app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);


app.use(routerAuth);
app.use(routerPerson);


app.listen(8080,() => {
    console.log("Running on port",8080);
});

