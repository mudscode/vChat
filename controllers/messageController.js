// messageController.js

const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");
const initializeSocket = require("../middlewares/socketConfig");

const io = initializeSocket();

const TypingStatus = (senderId, receiverId) => {
  io.to(receiverId).emit("typing", { senderId });
};

const stoppedTypingStatus = (receiverId) => {
  io.to(receiverId).emit("stoppedTyping", { receiverId });
};

const groupTypingStatus = (groupChatId, senderId) => {
  io.to(groupChatId).emit("groupTyping", { senderId });
};

const stoppedGroupTypingStatus = (groupChatId) => {
  io.to(groupChatId).emit("stoppedGroupTyping", { receiverId });
};

const sendMessage = async (
  senderId,
  receiverId,
  messageContent,
  isGroupMessage,
  groupChatId,
  attachments
) => {
  try {
    const sender = await User.findById(senderId);
    let receivers = [];

    if (!isGroupMessage) {
      TypingStatus(senderId, receiverId);
    } else {
      groupTypingStatus(senderId, groupChatId);
    }

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
      isGroupMessage,
      groupChatId,
      attachments
    );

    await Message.insertMany(newMessages);

    if (!isGroupMessage) {
      stoppedTypingStatus(receiverId);
    } else {
      stoppedGroupTypingStatus(groupChatId);
    }

    emitNewMessages(receivers, newMessages);
  } catch (error) {
    console.log(error.message);
  }
};

const createMessages = (
  sender,
  receivers,
  messageContent,
  isGroupMessage,
  groupChatId,
  attachments
) => {
  return receivers.map((receiver) => ({
    senderId: sender._id,
    receiverId: receiver._id,
    content: messageContent,
    status: "sent",
    type: "text",
    isGroupMessage: isGroupMessage,
    groupChatId: groupChatId,
    attachments: attachments || [],
  }));
};

const emitNewMessages = (receivers, newMessages) => {
  receivers.forEach((receiver) => {
    const messageForReceiver = newMessages.find((msg) => {
      msg.receiverId.toString() === receiver._id.toString();
    });
    if (messageForReceiver) {
      io.to(receiver._id).emit("newMessage", messageForReceiver);
    }
  });
};

const getMessages = async (userId, secondUserId) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: secondUserId },
        { senderId: secondUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    return messages;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteMessage = async (userId, messageId) => {
  try {
    const deleteMessage = await Message.findOneAndDelete({
      _id: messageId,
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateMessage = async (messageId, userId, newContent) => {
  try {
    const message = await Message.findById(messageId);

    if (message && message.senderId.equals(userId)) {
      const updatedMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        { $set: { content: newContent } },
        { new: true }
      );
      return updateMessage;
    } else {
      throw new Error("You are not authorized to update this message");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getGroupMessages = async (groupChatId) => {
  try {
    const messages = await Message.find({ groupChatId: groupChatId }).sort({
      createdAt: 1,
    });
    return messages;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteGroupMessages = async (userId, groupChatId) => {
  try {
    const deletedGroupMessages = await Group.find({
      groupChatId: groupChatId,
      senderId: userId,
      isGroupMessage: true
    });
    return deletedGroupMessages;
  } catch (error) {
    console.log(error.message);
  }
};

const updateGroupMessages = async (messageId, userId, newContent) => {
  try {
    const message = await Message.find(messageId);

    if(message && message.isGroupMessage && message.senderId.equals(userId)){
      const updatedGroupMessages = await Group.findOneAndUpdate(
        { _id: messageId },
        { $set: { content: newContent }},
        { new: true }
      );
      return updatedGroupMessages;
    } else {
      throw new Error("You are not authorized to updated this group Message.");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  sendMessage,
  TypingStatus,
  stoppedTypingStatus,
  groupTypingStatus,
  stoppedGroupTypingStatus,
  getMessages,
  getGroupMessages,
  updateMessage,
  updateGroupMessages,
  deleteMessage,
  deleteGroupMessages
};
