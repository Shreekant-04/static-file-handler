const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30 * 1000,
    });

    console.log(`MongoDB Connected ✔ `);
  } catch (error) {
    console.error(`✖ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
