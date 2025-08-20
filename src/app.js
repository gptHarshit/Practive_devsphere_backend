const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

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
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not Found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong !!");
  }
});

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  try {
    res.send(users);
  } catch (error) {
    res.status(404).send("Users not found");
  }
});

app.get("/userbyid", async (req, res) => {
  const user_id = "68a0ba188f2a143893ec7be6";
  const users = await User.findById(user_id);
  try {
    res.send(users);
  } catch (error) {
    res.status(404).send("Users not found");
  }
});

app.delete("/deleteuser", async (req, res) => {
  const user_id = req.body._id;
  const users = await User.findByIdAndDelete(user_id);
  try {
    res.send("User deleted Successfully");
  } catch (error) {
    res.status(404).send("Users not found");
  }
});

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = [
      "firstName",
      "lastName",
      "gender",
      "skills",
      "age",
      "password",
    ];

    const isAllowed_Updates = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );

    if (!isAllowed_Updates) {
      throw new Error("Update is not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("User data updated Successfully");
  } catch (error) {
    res.status(400).send("UPDATE FAILED : " + error.message);
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
