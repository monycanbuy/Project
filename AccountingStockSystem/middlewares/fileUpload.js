const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExtensions = /jpeg|jpg|png|svg/;
    const ext = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mime = allowedExtensions.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg, png, and svg files are allowed!"));
    }
  },
});

module.exports = upload;
