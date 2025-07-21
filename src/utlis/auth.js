const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("invalid token");
    }
    const decodedMessage = await jwt.verify(token, "mayank@1234");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("error :" + error.message);
  }
};

module.exports = {
  authUser,
};
