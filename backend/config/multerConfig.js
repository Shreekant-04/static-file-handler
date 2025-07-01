const multer = require("multer");
const crypto = require("crypto");
const { Readable } = require("stream");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
