const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending the connection request");
  res.send("Connection is sent by " + user.firstName + " " + user.lastName);
});

module.exports = requestRouter;
