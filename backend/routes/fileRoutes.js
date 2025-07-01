const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  uploadFile,
  getFile,
  getAllFiles,
  deleteFile,
  uploadMultipleFiles,
} = require("../controllers/fileController");
const upload = require("../config/multerConfig");
const router = express.Router();

router.get("/", protect, getAllFiles);
router.post("/upload", protect, upload.single("file"), uploadFile);
router.post(
  "/upload/multiple",
  protect,
  upload.array("files", 10),
  uploadMultipleFiles
);

module.exports = router;
