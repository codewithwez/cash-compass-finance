const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the environment.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[CashCompass DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CashCompass DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
