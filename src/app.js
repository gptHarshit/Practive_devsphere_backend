const express = require("express");

const app = express();

app.use("/test/math/1",(req,res) => {
    res.send("Hello fro the server ?????????");
});

app.use("/test/math",(req,res) => {
    res.send("math");
});

app.use("/robin",(req,res) => {
    res.send("Hello from Robin");
});



app.listen(3000,() => {
    console.log("Server is Successfully listening on PORT : 3000");
});