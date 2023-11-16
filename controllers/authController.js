const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

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
            groups: req.body.groups
        })

        const user = await newUser.save();
        res.status(201).json({ error: `User created Successfully. User: ${user}` });
    } catch (error) {
        res.status(500).json(error);
    }
};
