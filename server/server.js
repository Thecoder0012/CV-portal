import express from 'express';

const app = express();

app.get("/",(req,res) => {
    res.send("Hello world");
})

app.listen(8080,() => {
    console.log("Running on port",8080);
});