// messageRoutes.js

const router = require("express").Router();
const upload = require("../middlewares/multerConfig.js");
const {
  authenticateToken,
  authorizeUser,
} = require("../middlewares/authMiddleware.js");

const { sendMessage } = require("../controllers/messageController.js");

router.post(
  "/send-text-msg",
  authenticateToken,
  authorizeUser,
  async (req, res) => {
    try {
      // Call sendMessage for sending a text message
      await sendMessage(
        io,
        senderId,
        receiverId,
        messageContent,
        conversationId,
        isGroupMessage,
        groupChatId,
        []
      );

      res
        .status(200)
        .json({ success: true, message: "Text message sent successfully." });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.post(
  "/send-msg-with-attachements",
  authenticateToken,
  authorizeUser,
  upload.array("files", 5),
  async (req, res) => {
    const {
      senderId,
      receiverId,
      messageContent,
      conversationId,
      isGroupMessage,
      groupChatId,
    } = req.body;
    const files = req.files; // Access uploaded files from multer

    try {
      // Call sendMessage for sending a message with attachments
      await sendMessage(
        io,
        senderId,
        receiverId,
        messageContent,
        conversationId,
        isGroupMessage,
        groupChatId,
        files
      );

      res.status(200).json({
        success: true,
        message: "Message with attachments sent successfully.",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
