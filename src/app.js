const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Roman",
    lastName: "Reigns",
    emailId: "roman123@gmail.com",
    password: "roman405",
  };

  const user = new User(userObj);

  try {
    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("Error while saving the user" + err.message);
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
