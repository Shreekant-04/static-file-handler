const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let buckets = {};

const initGridFS = () => {
  const conn = mongoose.connection;

  conn.once("open", () => {
    // Initialize common buckets
    buckets["image"] = new GridFSBucket(conn.db, { bucketName: "images" });
    buckets["pdf"] = new GridFSBucket(conn.db, { bucketName: "pdfs" });
    buckets["doc"] = new GridFSBucket(conn.db, { bucketName: "docs" });
    buckets["other"] = new GridFSBucket(conn.db, { bucketName: "others" });
    console.log("GridFS buckets initialized.");
  });
};

// Function to get bucket based on MIME type
const getBucketByContentType = (contentType) => {
  if (contentType.startsWith("image")) return buckets["image"];
  if (contentType === "application/pdf") return buckets["pdf"];
  if (
    contentType === "application/msword" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return buckets["doc"];

  return buckets["other"];
};

module.exports = { initGridFS, getBucketByContentType };
