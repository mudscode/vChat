// messageController.js

const Message = require("../models/Message");
const User = require("../models/User");
const initializeScoket = require("../middlewares/socketConfig");

const sendMessage = async (
  senderId,
  receiverId,
  messageContent,
  conversationId,
  isGroupMessage,
  groupChatId,
  attachements
) => {
  try {
    const sender = await Message.findById(senderId);
    const receiver = await Message.findById(receiverId);

    if (!sender || !receiver) {
      console.log("User or receiver not found!");
    }

    const newMessage = new Message({
      senderId: sender._id,
      receiverId: receiver._id,
      content: messageContent,
      readBy: [],
      status: "sent",
      type: "text",
      conversationId: conversationId,
      isGroupMessage: isGroupMessage,
      groupChatId: groupChatId,
      attachments: attachments || [],
    });

    if (attachements && attachements.length > 0) {
      newMessage.attachements = attachements.map((file) => {
        file.filename;
      });
    }

    await newMessage.save();

    const io = initializeScoket();
    io.to(receiverId).emit("newMessage", newMessage);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMessage };
