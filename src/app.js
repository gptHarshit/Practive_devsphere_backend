const express = require("express");

const app = express();

app.get("/user",(req,res) => {
    res.send({firstName : "Keshav", LastName : "Gupta"});
});

app.delete("/user",(req,res) => {
    res.send("Deleted Successfully");
});

app.post("/user",(req,res) => {
    res.send("post call to user");
});

app.use("/robin",(req,res) => {
    res.send("Hello from Robin");
});

app.listen(3000,() => {
    console.log("Server is Successfully listening on PORT : 3000");
});