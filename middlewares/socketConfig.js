// socketConfig.js
// Socket.IO configuration middleware

const socketIO = require("socket.io");

const sendMessage = require("../controllers/messageController.js");

function initializeScoket(server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("New client connected.");

    socket.on("disconnect", () => {
      console.log("Client disconnected.");

      socket.on("chat", async (data) => {
        const { senderId, receiverId, messageContent } = data;

        try {
          await sendMessage(io, senderId, receiverId, messageContent);
          io.emit("chat", { senderId, receiverId, messageContent });
          io.emit("chat", message);
        } catch (error) {
          console.log(error.message);
        }
      });
    });
  });

  return io;
}

module.exports = initializeScoket;
