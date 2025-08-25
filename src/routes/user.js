const express = require("express");
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "gender",
      ]);
  //  console.log(data);
    res.json({ message: "Connection fetched successfully", data });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
