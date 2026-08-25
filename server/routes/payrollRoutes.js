const express = require("express");
const router = express.Router();
const Payslip = require("../models/Payslip");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const ensurePayslips = async (user) => {
  const existing = await Payslip.find({ employee: user._id }).sort({
    createdAt: -1,
  });

  if (existing.length > 0) {
    return existing;
  }

  const monthlySalary = Number(user.employee?.monthlySalary || 0);
  const docs = [];

  return Payslip.insertMany(docs);
};

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    if (req.user.role !== "Employee" && req.user.role !== "Admin") {
      throw createError(403, "Payroll is available for employee accounts.");
    }

    const payslips = await ensurePayslips(req.user);

    res.json({
      user: req.user.toClient(),
      payslips: payslips.map((item) => item.toClient()),
    });
  })
);

router.patch(
  "/salary",
  asyncHandler(async (req, res) => {
    const salary = Number(req.body.monthlySalary ?? req.body.salary);

    if (!Number.isFinite(salary) || salary <= 0) {
      throw createError(400, "Salary must be greater than zero.");
    }

    req.user.employee.monthlySalary = salary;
    if (req.body.nextPayDate !== undefined) {
      req.user.employee.nextPayDate = req.body.nextPayDate;
    }

    await req.user.save();
    res.json({ success: true, user: req.user.toClient() });
  })
);

// UPLOAD PAYSLIP ROUTE
router.post(
  "/upload",
  asyncHandler(async (req, res) => {
    const { period, date, netPay, status, fileUrl } = req.body;

    if (!period || netPay === undefined) {
      throw createError(400, "Period and net pay are required fields.");
    }

    const newPayslip = new Payslip({
      employee: req.user._id,
      period,
      date: date || formatDate(new Date()),
      netPay: Number(netPay),
      status: status || "Paid",
      fileUrl: fileUrl || "",
    });

    await newPayslip.save();

    res.status(201).json(newPayslip.toClient ? newPayslip.toClient() : newPayslip);
  })
);

module.exports = router;