const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("morgan");
const http = require("http");
const ejs = require("ejs");
const cors = require("cors");
const socketConfig = require("./middlewares/socketConfig.js");
const app = express();
const server = http.createServer(app);
const io = socketConfig(server, {
  cors: {
    origin: "*",
  },
});

// Mongodb Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((error) => {
    console.log(`An error occured ${error}`);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const groupRoutes = require("./routes/groupRoutes.js");

// Routes Usage
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/groups", groupRoutes);

// Port
port = process.env.PORT || 5000;

// Server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
