const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User", // reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
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

// compound indexing :-
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// this is the pre save method that is being used to check anything just before save
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(
      "You are not allowed to send connection request to yourself!!"
    );
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
