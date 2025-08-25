const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save" , function (next) {
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You are not allowed to send connection request to yourself!!"); 
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
