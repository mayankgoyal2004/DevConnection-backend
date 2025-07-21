const express = require("express");
const userRouter = express.Router();
const { authUser } = require("../utlis/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

userRouter.get("/user/request/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender about skills photos");

    res.json({ message: "Data fetched successfully", data: connectionRequest });
  } catch (error) {
    res.status(400).send("Not available" + error.message);
  }
});
userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender about skills photos")
      .populate("toUserId", "firstName lastName age gender about skills photos");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json(data);
  } catch (error) {
    res.status(404).send("user connection request not success" + error.message);
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

     const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const hideUser = new Set();
    connectionRequest.forEach((val) => {
      hideUser.add(val.fromUserId.toString());
      hideUser.add(val.toUserId.toString());
    });
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName lastName age photos gender skills").skip(skip).limit(limit); 

    res.send(user);
  } catch (error) {
    res.status(404).send("not success  " + error.message);
  }
});

module.exports = userRouter;
