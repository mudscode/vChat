const jwt = require("jsonwebtoken");

// Verifying Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (error, decodedUser) => {
      if (error) {
        res.status(403).json({ message: "Token not valid!" });
      }
      req.user = decodedUser;
      next();
    });
  } else {
    res.status(401).json({ message: "Token missing!" });
  }
};

// Authorize User
const authorizeUser = (req, res, next) => {
  if (req.user.id === req.params.id) {
    next();
  } else {
    res.status(403).json({ message: "Not Allowed!" });
  }
};

module.exports = { authenticateToken, authorizeUser };
