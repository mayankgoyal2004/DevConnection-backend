const express = require("express");
const authRout = express.Router();
const { authUser } = require("../utlis/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateSignIn } = require("../helper/authentication");

authRout.post("/signIn", async (req, res) => {
  try {
    authenticateSignIn(req);

    const { firstName, lastName, emailId, password, phoneNo } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hash,
      phoneNo,
    });

    await user.save();
    res.send("data save successfully");
  } catch (error) {
    res.status(401).send("not successfull" + error.message);
  }
});
authRout.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Please SignIn first");
    }
    const isPassword = await user.isValidPassword(password);
    if (isPassword) {
      const token = await user.getJWT();

      res.cookie("token", token);

      res.json(user);
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(401).send( error.message);
  }
});
authRout.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout success ");
});

module.exports = authRout;
