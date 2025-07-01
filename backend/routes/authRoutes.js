const express = require("express");
const router = express.Router();
const { login, signUp, verifyToken } = require("../controllers/authController");

router.post("/login", login);
router.get("/verify-token", verifyToken);
router.post("/signup", signUp);

module.exports = router;
