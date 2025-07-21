const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid user email " + value);
        }
      },
    },
    phoneNo: {
      type: Number,

      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Not a strong Password");
        }
      },
    },
    password: { type: String, required: true, minLength: 8 },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others","Male","Female","Others"],
        message: "not a valid gender",
      },

      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("not a valid gender");
      //   }
      // },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => {
          return v.length <= 10;
        },
        message: "you can add up to 10 skills",
      },
    },
    photos: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("not a valid url ");
        }
      },
    },
    about: {
      type: String,
      default: `hi there! welcome to our platform`,
      maxLength: [50, "the about data not more than 100"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "mayank@1234", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.isValidPassword = function (inputUserPassword) {
  const user = this;

  const isPasswordCorrect = bcrypt.compare(inputUserPassword, user.password);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
