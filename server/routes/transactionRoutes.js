const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

const getTransactions = async (userId, type) =>
  Transaction.find({ user: userId, type }).sort({ date: -1, createdAt: -1 });

const createTransaction = async (req, type) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError(400, "Amount must be greater than zero.");
  }

  const payload = {
    user: req.user._id,
    type,
    title:
      req.body.title ||
      req.body.description ||
      req.body.source ||
      (type === "deposit" ? "Allowance top-up" : "Untitled"),
    amount,
    category: req.body.category || (type === "deposit" ? "Income" : "Other"),
    period: req.body.period || "this_week",
    date: req.body.date ? new Date(req.body.date) : new Date(),
    source: req.body.source || "",
    notes: req.body.notes || "",
    dueDate: req.body.dueDate || "",
    isPaid: Boolean(req.body.isPaid),
  };

  return Transaction.create(payload);
};

const deleteByType = async (req, type) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
    type,
  });

  if (!deleted) {
    throw createError(404, "Transaction not found.");
  }

  return deleted;
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = { user: req.user._id };
    if (req.query.type) filter.type = req.query.type;

    const transactions = await Transaction.find(filter).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(transactions.map((item) => item.toClient()));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const type = req.body.type || "expense";
    if (!["expense", "deposit", "upcoming"].includes(type)) {
      throw createError(400, "Invalid transaction type.");
    }

    const transaction = await createTransaction(req, type);
    res.status(201).json(transaction.toClient());
  })
);

router.get(
  "/expenses",
  asyncHandler(async (req, res) => {
    const expenses = await getTransactions(req.user._id, "expense");
    res.json(expenses.map((item) => item.toClient()));
  })
);

router.post(
  "/expenses",
  asyncHandler(async (req, res) => {
    const expense = await createTransaction(req, "expense");
    res.status(201).json(expense.toClient());
  })
);

router.delete(
  "/expenses/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteByType(req, "expense");
    res.json({ success: true, id: deleted._id.toString() });
  })
);

router.get(
  "/deposits",
  asyncHandler(async (req, res) => {
    const deposits = await getTransactions(req.user._id, "deposit");
    res.json(deposits.map((item) => item.toClient()));
  })
);

router.post(
  "/deposits",
  asyncHandler(async (req, res) => {
    const deposit = await createTransaction(req, "deposit");
    res.status(201).json(deposit.toClient());
  })
);

router.delete(
  "/deposits/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteByType(req, "deposit");
    res.json({ success: true, id: deleted._id.toString() });
  })
);

router.get(
  "/upcoming",
  asyncHandler(async (req, res) => {
    const upcoming = await getTransactions(req.user._id, "upcoming");
    res.json(upcoming.map((item) => item.toClient()));
  })
);

router.post(
  "/upcoming",
  asyncHandler(async (req, res) => {
    const item = await createTransaction(req, "upcoming");
    res.status(201).json(item.toClient());
  })
);

router.delete(
  "/upcoming/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteByType(req, "upcoming");
    res.json({ success: true, id: deleted._id.toString() });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      throw createError(404, "Transaction not found.");
    }

    res.json({ success: true, id: deleted._id.toString() });
  })
);

module.exports = router;
