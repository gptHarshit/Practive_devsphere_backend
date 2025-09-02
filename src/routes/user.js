const express = require("express");
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
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

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "about",
  "gender",
  "skills",
];
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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = Connection.map((row) => {
      if (row.fromUserId &&  row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    }).filter(Boolean);
    res.json({
      message: "Connection that " + loggedInUser.firstName + " have are :- ",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : - " + error.message);
  }
});
// added the above .filter(Boolean); this line using chat gpt

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

//   /feed?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1)*limit;
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
   
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({data : users});
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
