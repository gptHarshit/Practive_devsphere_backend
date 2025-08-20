const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    // password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //new user creation
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "DevTinder@22$", {
        expiresIn: "0d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 3600000), // cookie will be removed after 10 hours
      });
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending the connection request");
  res.send("Connection is sent by " + user.firstName + " " + user.lastName);
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
