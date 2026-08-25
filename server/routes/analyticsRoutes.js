const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Reminder = require("../models/Reminder");
const Claim = require("../models/Claim");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Run aggregations and count queries concurrently
    const [transactionSummary, claimSummary, unreadReminders, expenseCount] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Claim.aggregate([
        { $match: { employee: userId } },
        {
          $group: {
            _id: null,
            totalClaims: { $sum: "$amount" },
            claimCount: { $sum: 1 }
          }
        }
      ]),
      Reminder.countDocuments({ user: userId, isRead: false }),
      Transaction.countDocuments({ user: userId, type: "expense" })
    ]);

    const expenses = transactionSummary.find((t) => t._id === "expense") || { total: 0 };
    const deposits = transactionSummary.find((t) => t._id === "deposit") || { total: 0 };
    const claimsData = claimSummary[0] || { totalClaims: 0, claimCount: 0 };

    res.json({
      totalSpent: expenses.total,
      totalDeposits: deposits.total,
      totalClaims: claimsData.totalClaims,
      unreadReminders,
      expenseCount,
      claimCount: claimsData.claimCount,
    });
  })
);

router.get(
  "/admin",
  authorize("Admin"),
  asyncHandler(async (req, res) => {
    const [students, employees, claimStats] = await Promise.all([
      User.countDocuments({ role: "Student" }),
      User.countDocuments({ role: "Employee" }),
      Claim.aggregate([
        {
          $group: {
            _id: null,
            totalClaims: { $sum: 1 },
            pendingClaims: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
            },
            approvedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "Approved"] }, "$amount", 0] }
            }
          }
        }
      ])
    ]);

    const stats = claimStats[0] || { totalClaims: 0, pendingClaims: 0, approvedAmount: 0 };

    res.json({
      students,
      employees,
      claims: stats.totalClaims,
      pendingClaims: stats.pendingClaims,
      approvedAmount: stats.approvedAmount,
    });
  })
);

module.exports = router;