const dns = require("dns");

// Fallback to Google DNS ONLY in local development
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

require("dotenv").config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const app = require("./app");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[CashCompass API] Running on port ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error(`[Unhandled Error]: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error(`[CashCompass DB Startup Failed]: ${err.message}`);
    process.exit(1);
  });