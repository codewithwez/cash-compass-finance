require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`[CashCompass API] Server listening on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Error]: ${err.message}`);
  server.close(() => process.exit(1));
});