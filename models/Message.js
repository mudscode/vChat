const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    type: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    isGroupMessage: {
      type: Boolean,
      default: false,
    },
    groupChatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    attachements: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
