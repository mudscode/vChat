const router = require("express").Router();
const authController = require("../controllers/authController.js");
const { authenticateToken, authorizeUser } = require("../middlewares/authMiddleware.js");

// Register a new User 
router.post("/register", authController.register);

// User login 
router.post("/login", authController.login);

// User logout
router.post("/logout", authenticateToken, authorizeUser, authController.logout);

module.exports = router;