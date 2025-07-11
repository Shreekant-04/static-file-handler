const { getBucketByContentType } = require("../config/gridFs");
const crypto = require("crypto");
const { Readable } = require("stream");

// Single File Upload
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const bucket = getBucketByContentType(req.file.mimetype);

  if (!bucket) {
    return res
      .status(500)
      .json({ message: "No bucket found for this file type" });
  }

  const randomName = crypto.randomBytes(16).toString("hex");
  const extension = req.file.originalname.split(".").pop();
  const filename = `${randomName}.${extension}`;

  const readableStream = new Readable();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      contentType: req.file.mimetype,
      originalname: req.file?.originalname || Date.now(),
    },
  });

  readableStream.pipe(uploadStream);

  uploadStream.on("finish", () => {
    const url = `${req.protocol}://${req.get(
      "host"
    )}/${filename}?type=${encodeURIComponent(req.file.mimetype)}`;
    res.status(201).json({
      message: "File uploaded successfully",
      filename,
      url,
    });
  });

  uploadStream.on("error", (err) => {
    res.status(500).json({ message: "Upload error", error: err.message });
  });
};
// Single File Retrieval
const getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query;

    if (!type || !filename) {
      return res
        .status(400)
        .json({ message: "Filetype and filename are required" });
    }

    const bucket = getBucketByContentType(type);

    if (!bucket) {
      return res
        .status(500)
        .json({ message: "No bucket found for this file type" });
    }

    const files = await bucket.find({ filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    res.set(
      "Content-Type",
      file.contentType ||
        (file.metadata && file.metadata.contentType) ||
        "application/octet-stream"
    );
    res.set("Content-Disposition", `inline; filename="${filename}"`);

    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on("error", (err) => {
      return res
        .status(500)
        .json({ message: "Error streaming file", error: err.message });
    });

    downloadStream.pipe(res);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const { type } = req.query;
    const { filename } = req.params;

    if (!type) {
      return res.status(400).json({ message: "Type is required in query" });
    }
    if (!filename) {
      return res.status(400).json({ message: "Required filename." });
    }

    const bucket = getBucketByContentType(type);

    if (!bucket) {
      return res
        .status(500)
        .json({ message: "No bucket found for this file type" });
    }

    const files = await bucket.find({ filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileId = files[0]._id;

    await bucket.delete(fileId);

    res.json({ message: "File deleted successfully", filename });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting file", error: err.message });
  }
};

// Paginated File Listing
const getAllFiles = async (req, res) => {
  const { bucketName } = req.query;

  if (!bucketName) {
    return res
      .status(400)
      .json({ message: "Bucket name is required in query" });
  }

  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let skip = (page - 1) * limit;

  try {
    let files = [];
    let totalFiles = 0;

    if (bucketName === "all") {
      // Assume these are your known buckets
      const mongoose = require("mongoose");
      const buckets = ["image", "pdf", "doc", "other"];

      for (const name of buckets) {
        const bucket = getBucketByContentType(name);
        if (!bucket) continue;
        const bucketFiles = await bucket.find().toArray();
        const filesWithUrl = bucketFiles.map((file) => ({
          filename: file.filename,
          contentType:
            file.contentType || (file.metadata && file.metadata.contentType),
          originalname: file.metadata && file.metadata.originalname,
          uploadDate: file.uploadDate,
          length: file.length,
          url: `${req.protocol}://${req.get("host")}/${
            file.filename
          }?type=${name}`,
        }));

        files = files.concat(filesWithUrl);
      }

      // Sort all files by upload date descending (optional but good for UX)
      files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      totalFiles = files.length;

      // Apply pagination on merged files
      const paginatedFiles = files.slice(skip, skip + limit);

      if (paginatedFiles.length === 0) {
        return res.status(404).json({ message: "No files found" });
      }

      return res.json({
        pagination: {
          totalFiles,
          currentPage: page,
          totalPages: Math.ceil(totalFiles / limit),
        },
        files: paginatedFiles,
      });
    }

    // If a specific bucket is requested
    const bucket = getBucketByContentType(bucketName);

    if (!bucket) {
      return res
        .status(500)
        .json({ message: "No bucket found for this file type" });
    }

    totalFiles = await bucket.s._filesCollection.countDocuments({});

    const filesCursor = bucket.find().skip(skip).limit(limit);
    const filesInBucket = await filesCursor.toArray();

    if (!filesInBucket || filesInBucket.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    let filesWithUrl = filesInBucket.map((file) => ({
      filename: file.filename,
      contentType:
        file.contentType || (file.metadata && file.metadata.contentType),
      originalname: file.metadata && file.metadata.originalname,
      uploadDate: file.uploadDate,
      length: file.length,
      url: `${req.protocol}://${req.get("host")}/${
        file.filename
      }?type=${bucketName}`,
    }));

    filesWithUrl.sort(
      (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
    );

    res.json({
      pagination: {
        totalFiles,
        currentPage: page,
        totalPages: Math.ceil(totalFiles / limit),
      },
      files: filesWithUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching files", error: error.message });
  }
};

// Multiple File Upload
const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  let uploadedFiles = [];
  let uploadCount = 0;

  req.files.forEach((file) => {
    const bucket = getBucketByContentType(file.mimetype);

    if (!bucket) {
      return res
        .status(500)
        .json({ message: "No bucket found for this file type" });
    }

    const randomName = crypto.randomBytes(16).toString("hex");
    const extension = file.originalname.split(".").pop();
    const filename = `${randomName}.${extension}`;

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        contentType: file.mimetype,
        originalname: file.originalname || Date.now(),
      },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      const url = `${req.protocol}://${req.get(
        "host"
      )}/${filename}?type=${encodeURIComponent(file.mimetype)}`;

      uploadedFiles.push({
        filename: uploadStream.filename,
        contentType: file.mimetype,
        originalname: file.originalname,
        uploadDate: uploadStream.uploadDate || new Date(),
        length: uploadStream.length || file.size,
        url: url,
      });

      uploadCount++;
      if (uploadCount === req.files.length) {
        return res.status(201).json({
          message: "Files uploaded successfully",
          files: uploadedFiles,
        });
      }
    });

    uploadStream.on("error", (err) => {
      return res
        .status(500)
        .json({ message: "Upload error", error: err.message });
    });
  });
};
module.exports = {
  uploadFile,
  getFile,
  deleteFile,
  getAllFiles,
  uploadMultipleFiles,
};
