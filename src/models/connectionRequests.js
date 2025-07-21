const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId , required: true, ref:"User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId ,required: true,ref:"User" },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({fromUserId:1 , toUserId:1})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
