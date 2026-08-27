const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Core Middleware - Dynamic CORS Origin Handler
const allowedOrigin = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.replace(/\/$/, "") // Removes trailing slash automatically
  : "*";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or matching origins
      if (!origin || allowedOrigin === "*" || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to accept the request origin dynamically
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    app: "CashCompass API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/claims", require("./routes/claimRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/payroll", require("./routes/payrollRoutes"));

// Global Error Handler
app.use(errorHandler);

module.exports = app;