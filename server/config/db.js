const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is missing from environment variables.");
    }

    // Enable Mongoose command tracing
    mongoose.set("debug", (collectionName, method, query, doc) => {
      console.log(`[MONGO TRACE] -> ${collectionName}.${method}()`);
    });

    const conn = await mongoose.connect(uri, {
      dbName: "cashcompass",
    });

    console.log(`[CashCompass DB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CashCompass DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;