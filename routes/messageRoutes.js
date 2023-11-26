// messageRoutes.js

const router = require("express").Router();
const upload = require("../middlewares/multerConfig.js");
const {
  authenticateToken,
  authorizeUser,
} = require("../middlewares/authMiddleware.js");

const messageController = require("../controllers/messageController.js");

// Send a message
router.post(
  "/send/:id",
  authenticateToken,
  authorizeUser,
  upload.array("files", 3),
  async (req, res) => {
    try {
      const {
        senderId,
        receiverId,
        messageContent,
        isGroupMessage,
        groupChatId,
        attachments,
      } = req.body;
      const files = req.files || [];

      await messageController.sendMessage(
        senderId,
        receiverId,
        messageContent,
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

// Get messages between two users
router.get("/messages/:userId/:secondUserId", async (req, res) => {
  try {
    const { userId, secondUserId } = req.params;
    const messages = await messageController.getMessages(userId, secondUserId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete("/messages/:userId/:messageId", async (req, res) => {
  try {
    const { userId, messageId } = req.params;
    await messageController.deleteMessage(userId, messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a message
router.put("/messages/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, newContent } = req.body;
    const updatedMessage = await messageController.updateMessage(
      messageId,
      userId,
      newContent
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get group messages
router.get("/group-messages/:groupChatId", async (req, res) => {
  try {
    const { groupChatId } = req.params;
    const groupMessages = await messageController.getGroupMessages(groupChatId);
    res.status(200).json(groupMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete group messages
router.delete("/group-messages/:userId/:groupChatId", async (req, res) => {
  try {
    const { userId, groupChatId } = req.params;
    const deletedGroupMessages = await messageController.deleteGroupMessages(
      userId,
      groupChatId
    );
    res.status(200).json(deletedGroupMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update group message
router.put("/group-messages/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, newContent } = req.body;
    const updatedGroupMessage = await messageController.updateGroupMessages(
      messageId,
      userId,
      newContent
    );
    res.status(200).json(updatedGroupMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
