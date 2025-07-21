const validator = require("validator");
const { aggregate } = require("../models/user");

const authenticateSignIn = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is invalid");
  }
  if (!password) {
    throw new Error("enter your password");
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("first name should be between 4 and 50");
  }
  if (!validator.isAlpha(firstName, "en-US", { ignore: " " })) {
    throw new Error("First name must contain only letters");
  }
};

const validUserUpdate = function (req) {
  const user = req.body;
  const authorizeUpdate = [
    "firstName",
    "lastName",
    "age",
    "phoneNo",
    "gender",
    "skills",
    "photos",
    "about",
  ];
  const isAllowed = Object.keys(user).every((value) =>
    authorizeUpdate.includes(value)
  );
  return isAllowed;
};

module.exports = { authenticateSignIn, validUserUpdate };
