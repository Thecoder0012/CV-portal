import express from 'express';
import session from "express-session"
import router from './routes/auth.js';

const app = express();
app.use(express.json())

app.use(router)

app.get("/",(req,res) => {
    res.send("Hello world");
})


app.listen(8080,() => {
    console.log("Running on port",8080);
});




