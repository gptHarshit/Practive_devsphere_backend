const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const {run} = require("../utils/sendEmail");


requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type :- " + status,
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not Found" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      const emailRes = await run();
  


      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["rejected", "accepted"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connnection request could not be found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection Request is " + status, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;


// const express = require("express");
// const requestRouter = express.Router();
// const { userAuth } = require("../middlewares/auth");
// const ConnectionRequest = require("../models/connectionRequest");
// const User = require("../models/user");
// const { sendDynamicEmail } = require("../utils/emailService");

// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;
//       const allowedStatus = ["ignored", "interested"];
      
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({
//           message: "Invalid status type :- " + status,
//         });
//       }
      
//       const toUser = await User.findById(toUserId);
//       if (!toUser) {
//         return res.status(404).json({ message: "User not Found" });
//       }
      
//       const existingConnectionRequest = await ConnectionRequest.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           { fromUserId: toUserId, toUserId: fromUserId },
//         ],
//       });

//       if (existingConnectionRequest) {
//         return res
//           .status(400)
//           .send({ message: "Connection Request Already Exists!!" });
//       }
      
//       const connectionRequest = new ConnectionRequest({
//         fromUserId,
//         toUserId,
//         status,
//       });
//       const data = await connectionRequest.save();

//       // ✅ UPDATED: SEND DYNAMIC EMAIL ONLY FOR "INTERESTED" STATUS
//       if (status === "interested") {
//         try {
//           await sendDynamicEmail(toUser.emailId, "connectionRequest", {
//             senderName: `${req.user.firstName} ${req.user.lastName}`,
//             receiverName: `${toUser.firstName} ${toUser.lastName}`,
//             senderMessage: `I'm interested in connecting with you on DevSphere!`,
//             profileLink: `https://your-devsphere-app.com/profile/${req.user._id}`
//           });
//           console.log(`✅ Connection email sent to ${toUser.emailId}`);
//         } catch (emailError) {
//           console.error("❌ Email sending failed:", emailError);
//           // Don't fail the request if email fails
//         }
//       }

//       res.json({
//         message:
//           req.user.firstName + " is " + status + " in " + toUser.firstName,
//         data,
//       });
//     } catch (error) {
//       res.status(400).send("ERROR :" + error.message);
//     }
//   }
// );

// requestRouter.post(
//   "/request/review/:status/:requestId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const loggedInUser = req.user;
//       const { status, requestId } = req.params;

//       const allowedStatus = ["rejected", "accepted"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({ message: "Status not allowed" });
//       }

//       const connectionRequest = await ConnectionRequest.findOne({
//         _id: requestId,
//         toUserId: loggedInUser._id,
//         status: "interested",
//       });
//       if (!connectionRequest) {
//         return res
//           .status(404)
//           .json({ message: "Connnection request could not be found" });
//       }

//       connectionRequest.status = status;
//       const data = await connectionRequest.save();
      
//       // ✅ OPTIONAL: SEND EMAIL WHEN REQUEST IS ACCEPTED
//       if (status === "accepted") {
//         try {
//           const fromUser = await User.findById(connectionRequest.fromUserId);
//           await sendDynamicEmail(fromUser.emailId, "connectionRequest", {
//             senderName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
//             receiverName: `${fromUser.firstName} ${fromUser.lastName}`,
//             senderMessage: `I've accepted your connection request on DevSphere! Let's connect.`,
//             profileLink: `https://your-devsphere-app.com/profile/${loggedInUser._id}`
//           });
//           console.log(`✅ Acceptance email sent to ${fromUser.emailId}`);
//         } catch (emailError) {
//           console.error("❌ Acceptance email failed:", emailError);
//         }
//       }

//       res.json({ message: "Connection Request is " + status, data });
//     } catch (err) {
//       res.status(400).send("ERROR : " + err.message);
//     }
//   }
// );

// module.exports = requestRouter;