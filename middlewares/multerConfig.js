// multerConfig.js
// Middleware to handle files/images uploads

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, "storage", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uplaod = multer({ storage });

module.exports = upload;
