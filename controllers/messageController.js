const Message = require("../models/Message");
const User = require("../models/User");

const sendMessage = async (io, senderId, receiverId, messageContent) => {
  try {
    const user = await User.findById(userId);
    const receiver = await User.findById(receiverId);

    if (!user || !receiver) {
      console.log("User or receiver not found.");
      return;
    }

    const newMessage = new Message({
        senderId: sender._id,
        receiverId: receiver._id,
        content: messageContent,
        // Will come later...
    });

    await newMessage.save();

    io.emit("chat", { sender: sender.username, content: messageContent });

  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMessage };