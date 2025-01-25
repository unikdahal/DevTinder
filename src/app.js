const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
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
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
      }
  )
}catch(err) {
    console.log("Error connecting to database", err);
}