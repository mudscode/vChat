const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

// Mongodb Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(`An error occured ${error}`);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Port
port = process.env.PORT || 5000;
// Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
