const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


// authRouter.post("/signup", async (req, res) => {
//   try {
//     // validation of data
//     validateSignUpData(req);
//     // password encryption
//     const { firstName, lastName, emailId, password } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);
    

//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });
//     const savedUser = await user.save();
//     const token = await savedUser.getJWT();
//     res.cookie("token", token, {
//       expires: new Date(Date.now() + 8 * 3600000),
//     });


//     try {
//       await sendDynamicEmail(savedUser.emailId, "welcome", {
//         userName: `${savedUser.firstName} ${savedUser.lastName}`
//       });
//       console.log(` Welcome email sent to ${savedUser.emailId}`);
//     } catch (emailError) {
//       console.error(" Welcome email failed:", emailError);

//     }

//     res.json({ message: "User Added Successfully", data: savedUser });
//   } catch (error) {
//     res.status(400).send("ERROR : " + error.message);
//   }
// });

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    // password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout Successfully");
});

module.exports = authRouter;
