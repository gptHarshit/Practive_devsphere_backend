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

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
