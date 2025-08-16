const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user")

const app = express();

app.post("/signup",async (req,res)=> {
    const userObj = {
        firstName : "Anmol",
        lastName : "Gupta",
        emailId : "anmol123@gmail.com",
        password :  "anmol006"
    };

    const user = new User(userObj);
    await user.save();
    res.send("User Added Successfully!!");
})

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully");

    app.listen(3000, () => {
      console.log("Server is Successfully listening on PORT : 3000");
    });
  })
  .catch(() => {
    console.log("Cannot Connect with database!!");
  });
