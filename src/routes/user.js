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
    res.json({ message: "Connection fetched successfully", data });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

//a bug can be in this api ,be carefull if any bug appear so make sure to check this API
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const Connection = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "gender",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "gender",
        "skills",
      ]);
    const data = Connection.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId; 
      }
    });
    res.json({
      message: "Connection that " + loggedInUser.firstName + " have are :- ",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : - " + error.message);
  }
});

module.exports = userRouter;
