// socketConfig.js
// Socket.IO configuration middleware

const socketIO = require("socket.io");

function initializeSocket(server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });

    socket.on("chat", (newMessage) => {
      socket.broadcast.emit(newMessage);
    });
  });

  return io;
}

module.exports = initializeSocket;
