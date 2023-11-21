// messageController.js

const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");
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
    const sender = await User.findById(senderId);
    let receivers = [];

    if (isGroupMessage) {
      const group = await Group.findById(groupChatId);
      if (group) {
        receivers = await User.find({ _id: { $in: group.members } });
      } else {
        return console.log("Group not found.");
      }
    } else {
      const receiver = await User.findById(receiverId);
      if (receiver) {
        receivers.push(receiver);
      } else {
        return console.log("Receiver not found.");
      }
    }

    if (receivers.length === 0) {
      return console.log("Receiver not found.");
    }

    const newMessages = createMessages(
      sender,
      receivers,
      messageContent,
      conversationId,
      isGroupMessage,
      groupChatId,
      attachements
    );

    await Message.insertMany(newMessages);

    emitNewMessages(receivers, newMessages);
  } catch (error) {
    console.log(error.message);
  }
};

const createMessages = (
  sender,
  receivers,
  messageContent,
  conversationId,
  isGroupMessage,
  groupChatId,
  attachements
) => {
  return receivers.map((receiver) => ({
    senderId: sender._id,
    reciverId: receiver._id,
    content: messageContent,
    readBy: [],
    status: "sent",
    type: "text",
    conversationId: conversationId,
    isGroupMessage: isGroupMessage,
    groupChatId: groupChatId,
    attachments: attachments || [],
  }));
};

const emitNewMessages = (receivers, newMessages) => {
  const io = initializeScoket();

  receivers.forEach((receiver) => {
    const messageForReceiver = newMessages.find((msg) => {
      msg.receiverId.toString() === receiver._id.toString();
    });
    if (messageForReceiver) {
      io.to(receiver._id).emit("newMessage", messageForReceiver);
    }
  });
};

module.exports = { sendMessage };
