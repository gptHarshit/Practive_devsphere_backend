const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error in saving the user" + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if(user.length === 0) {
        res.status(404).send("User not Found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

app.get("/feed", async (req,res)=> {
    const users = await User.find({});
    try {
        res.send(users);
    } catch (error) {
        res.status(404).send("Users not found");
    }
});


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
