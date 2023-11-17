const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

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

// Routes Usage
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Port
port = process.env.PORT || 5000;
// Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
