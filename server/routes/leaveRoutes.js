const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  createLeaveSchema,
  updateLeaveStatusSchema,
} = require("../validators/leaveValidator");

router.use(protect);

const ptoResponse = async (userId) => {
  const user = await User.findById(userId);
  const history = await Leave.find({ employee: userId }).sort({ createdAt: -1 });

  return {
    availableDays: user.pto?.availableDays ?? 0,
    usedDays: user.pto?.usedDays ?? 0,
    history: history.map((item) => item.toClient()),
  };
};

router.get(
  "/mine",
  asyncHandler(async (req, res) => {
    res.json(await ptoResponse(req.user._id));
  })
);

router.post(
  "/",
  validate(createLeaveSchema),
  asyncHandler(async (req, res) => {
    const { days, type, status } = req.body;

    if (days > (req.user.pto?.availableDays || 0)) {
      throw createError(
        400,
        `Only ${req.user.pto?.availableDays || 0} PTO days are available.`
      );
    }

    const startDate = req.body.startDate || new Date().toISOString().slice(0, 10);
    const endDate = req.body.endDate || startDate;

    await Leave.create({
      employee: req.user._id,
      type,
      startDate,
      endDate,
      days,
      status,
    });

    if (!req.user.pto) {
      req.user.pto = { availableDays: 0, usedDays: 0 };
    }

    req.user.pto.availableDays = Math.max(
      0,
      (req.user.pto.availableDays || 0) - days
    );
    req.user.pto.usedDays = (req.user.pto.usedDays || 0) + days;
    await req.user.save();

    res.status(201).json(await ptoResponse(req.user._id));
  })
);

router.patch(
  "/:id/status",
  authorize("Admin"),
  validate(updateLeaveStatusSchema),
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      throw createError(404, "Leave request not found.");
    }

    leave.status = status;
    await leave.save();
    res.json(leave.toClient());
  })
);

module.exports = router;