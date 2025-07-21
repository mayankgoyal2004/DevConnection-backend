const express = require("express");
const profileRoute = express.Router();
const { authUser } = require("../utlis/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validUserUpdate } = require("../helper/authentication");

profileRoute.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send("Error :" + error.message);
  }
});
profileRoute.patch("/profile/update", authUser, async (req, res) => {
  try {
    if (!validUserUpdate(req)) {
      throw new Error("edit not allowed");
    }
   
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({ message: "User profile updated", data: loggedInUser });
  } catch (error) {
    res.status(404).send("Error :" + error.message);
  }
});
profileRoute.patch("/profile/forgetPassword", authUser, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword } = req.body;
    const isPassword = await user.isValidPassword(password);
    if (!isPassword) {
      throw new Error("password not valid");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("not a strong password");
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    res.send("successful Update");
  } catch (error) {
    res.status(404).send("Error :" + error.message);
  }
});
module.exports = profileRoute;
