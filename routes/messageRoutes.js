// messageRoutes.js

const router = require("express").Router();
const upload = require("../middlewares/multerConfig.js");
const {
  authenticateToken,
  authorizeUser,
} = require("../middlewares/authMiddleware.js");

const { sendMessage } = require("../controllers/messageController.js");

router.post(
  "/send-msg",
  authenticateToken,
  authorizeUser,
  upload.array("files", 3),
  async (req, res) => {
    try {
      const {
        senderId,
        receiverId,
        messageContent,
        conversationId,
        isGroupMessage,
        groupChatId,
      } = req.body;
      const files = req.files || [];

      await sendMessage(
        senderId,
        receiverId,
        messageContent,
        conversationId,
        isGroupMessage,
        groupChatId,
        files
      );

      res.status(200).json({ message: "Message Sent Successfully." });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

module.exports = router;
