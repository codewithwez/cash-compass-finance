const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect, authorize } = require("../middleware/authMiddleware");
const { clientIdFilter } = require("../utils/clientId");

router.use(protect);

const claimFilter = (id) => ({ $or: clientIdFilter(id) });

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = req.user.role === "Admin" ? {} : { employee: req.user._id };
    const claims = await Claim.find(filter).sort({ createdAt: -1 });
    res.json(claims.map((claim) => claim.toClient()));
  })
);

router.get(
  "/mine",
  asyncHandler(async (req, res) => {
    const claims = await Claim.find({ employee: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(claims.map((claim) => claim.toClient()));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw createError(400, "Claim amount must be greater than zero.");
    }

    const employee = req.user;
    const claim = await Claim.create({
      employee: employee._id,
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeePublicId: employee.publicId,
      department: employee.employee?.department || "",
      role: employee.employee?.position || employee.role,
      title: req.body.title || req.body.description || "Expense Claim",
      description: req.body.description || req.body.title || "Expense Claim",
      category: req.body.category || "General",
      amount,
      status: req.body.status || "Pending",
      receiptType: req.body.receiptType || "PDF",
      receiptUrl: req.body.receiptUrl || "",
      requestedDate: req.body.date || req.body.requestedDate || new Date().toISOString(),
    });

    if (employee.role === "Employee") {
      employee.employee.expensePolicy.spent =
        Number(employee.employee.expensePolicy?.spent || 0) + amount;
      await employee.save();
    }

    res.status(201).json(claim.toClient());
  })
);

router.patch(
  "/:id/status",
  authorize("Admin"),
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      throw createError(400, "Invalid claim status.");
    }

    const claim = await Claim.findOne(claimFilter(req.params.id));

    if (!claim) {
      throw createError(404, "Claim not found.");
    }

    claim.status = status;
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    await claim.save();

    res.json(claim.toClient());
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const filter =
      req.user.role === "Admin"
        ? claimFilter(req.params.id)
        : { ...claimFilter(req.params.id), employee: req.user._id };

    const deleted = await Claim.findOneAndDelete(filter);

    if (!deleted) {
      throw createError(404, "Claim not found.");
    }

    if (req.user.role === "Employee") {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { "employee.expensePolicy.spent": -deleted.amount },
      });
    }

    res.json({ success: true, id: deleted.publicId || deleted._id.toString() });
  })
);

module.exports = router;
