require('dotenv').config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);


try{
  connectDB().then(
      ()=>{
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
      }
  )
}catch(err) {
    console.log("Error connecting to database", err);
}