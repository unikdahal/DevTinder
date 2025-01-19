const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/", (req, res) => {
  res.send("Hello World");
});

// This wil never be reached as all the requests are handled by the first route
//hence the order of routes is important
app.use("/about", (req, res) => {
  res.send("About Us");
});
