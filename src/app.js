const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/authRouth");
const profileRouter = require("./routers/profileRout");
const connectionRout = require("./routers/connectionRout");
const userRouter = require("./routers/userRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: "http://localhost:5173", credentials: true    }));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRout);
app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(7777, (error) => {
      if (error) {
        console.log("something wrong");
      }
      console.log("server is running ");
    });
  })
  .catch((error) => {
    console.error("not connected", error);
  });
