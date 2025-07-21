const express = require("express");
const connectionRoute = express.Router();
const { authUser } = require("../utlis/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequests");

connectionRoute.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.toString() === toUserId) {
        throw new Error("you cant send request to yourself");
      }
      const authorize = ["interested", "ignored"];
      const authorizeData = authorize.includes(status);
      if (!authorizeData) {
        return res.status(400).json("not valid status " + status);
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("connection request already send ");
      }
      const isMatch = await User.findById(toUserId);
      if (!isMatch) {
        throw new Error("no user exist ");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: "connection request send successfully ", data });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

connectionRoute.patch(
  "/request/send/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const { status, requestId } = req.params;
      console.log("Received status:", status);

      const authorize = ["accepted", "rejected"];
      const authorizeData = authorize.includes(status);

      if (!authorizeData) {
        throw new Error("invalid status request ");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("not a valid request");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.send(data);
    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
);

module.exports = connectionRoute;
