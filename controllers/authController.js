const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const requiredFields = ["username", "email", "password"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "User already exists with the email you entered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: req.body.avatar,
      bio: req.body.bio,
      groups: req.body.groups,
    });

    const user = await newUser.save();
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "8d",
      }
    );
    const { _id, username, avatar, bio, groups } = user.toObject();
    return res.status(200).json({
      _id,
      username,
      email,
      avatar,
      bio,
      groups,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User logout
const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, logout };
