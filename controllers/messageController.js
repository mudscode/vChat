// messageController.js

const Message = require("../models/Message");
const User = require("../models/User");

const sendMessage = async (
  io,
  senderId,
  receiverId,
  messageContent,
  conversationId,
  isGroupMessage,
  groupChatId,
  attachments
) => {
  try {
    const user = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!user || !receiver) {
      console.log("User or receiver not found.");
      return;
    }

    const newMessage = new Message({
      senderId: sender._id,
      receiverId: receiver._id,
      content: messageContent,
      readBy: null,
      status: "sent",
      type: "text",
      conversationId: conversationId,
      isGroupMessage: isGroupMessage,
      groupChatId: groupChatId,
      attachements: [],
    });

    if (attachements && attachements.length > 0) {
      newMessage.attachements = attachements.map((file) => file.filename);
    }

    await newMessage.save();

    io.emit("chat", {
      sender: sender.username,
      content: messageContent,
      attachements: newMessage.attachements,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMessage };
