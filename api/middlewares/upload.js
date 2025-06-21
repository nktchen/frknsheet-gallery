const multer = require("multer");
const { randomUUID } = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "img"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${randomUUID()}.${ext}`);
  },
});

const upload = multer({ storage });
module.exports = upload;
