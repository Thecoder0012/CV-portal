import express from "express";
import session from "express-session";
import router from "./routes/auth.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: true,
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
      httpOnly: true,
    },
  })
);

app.use(router);

app.listen(8080,() => {
    console.log("Running on port",8080);
});

