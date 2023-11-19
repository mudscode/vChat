const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http");
const socketConfig = require("./middlewares/socketConfig.js");

const app = express();
const server = http.createServer(app);
const io = socketConfig(server)

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
app.use(morgan("dev"));

// Routes Usage
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Port
port = process.env.PORT || 5000;
// Server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
