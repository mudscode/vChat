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
      if (newMessage.receiverId) {
        socket.to(newMessage.receiverId).emit("chat", newMessage);
      } else if (newMessage.groupChatId) {
        socket.to(newMessage.groupChatId).emit("chat", newMessage);
      }
    });

    socket.on("typing", (data) => {
      socket.to(data.receiverId).emit("typing", data);
    });

    socket.on("stoppedTyping", (data) => {
      socket.to(data.receiverId).emit("stoppedTyping");
    });

    socket.on("groupTyping", (data) => {
      socket.to(data.groupChatId).emit("groupTyping", data);
    });

    socket.on("stoppedGroupTyping", (data) => {
      socket.to(data.groupChatId).emit("stoppedGroupTyping");
    });
  });

  return io;
}

module.exports = initializeSocket;
