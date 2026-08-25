const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

const budgetWithSpent = async (budget) => {
  const spent = await Transaction.aggregate([
    {
      $match: {
        user: budget.user,
        type: "expense",
        category: budget.category,
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  budget.spent = spent[0]?.total || 0;
  return budget.toClient();
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    const response = await Promise.all(budgets.map(budgetWithSpent));
    res.json(response);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, category, limit, period, startDate, endDate } = req.body;

    if (!name || !limit) {
      throw createError(400, "Budget name and limit are required.");
    }

    const budget = await Budget.create({
      user: req.user._id,
      name,
      category: category || "General",
      limit: Number(limit),
      period: period || "monthly",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(201).json(await budgetWithSpent(budget));
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      throw createError(404, "Budget not found.");
    }

    ["name", "category", "period"].forEach((field) => {
      if (req.body[field] !== undefined) budget[field] = req.body[field];
    });
    if (req.body.limit !== undefined) budget.limit = Number(req.body.limit);
    if (req.body.startDate !== undefined) budget.startDate = new Date(req.body.startDate);
    if (req.body.endDate !== undefined) budget.endDate = new Date(req.body.endDate);

    await budget.save();
    res.json(await budgetWithSpent(budget));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      throw createError(404, "Budget not found.");
    }

    res.json({ success: true, id: deleted._id.toString() });
  })
);

module.exports = router;
