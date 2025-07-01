const express = require("express");

const app = express();
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const morgan = require("morgan");
const { getFile, deleteFile } = require("./controllers/fileController");
const { protect } = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to static file handler." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.get("/:filename", getFile);
app.delete("/:filename", protect, deleteFile);

module.exports = app;
