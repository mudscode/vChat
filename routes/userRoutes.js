const { authenticateToken, authorizeUser } = require("../middlewares/authMiddleware.js");
const router = require("express").Router();
const { updateUser, getUser, deleteUser } = require("../controllers/userController.js");

// Update a user
router.put("/:id", authenticateToken, authorizeUser, updateUser);

// Delete a user
router.delete("/:id", authenticateToken, authorizeUser, deleteUser);

// Get a user 
router.get("/:id", authenticateToken, authorizeUser, getUser );

module.exports = router;