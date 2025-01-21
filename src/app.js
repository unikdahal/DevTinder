const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests");


app.route("/auth/", authRouter);
app.route("/profile/", profileRouter);
app.route("/request/", requestRouter);


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