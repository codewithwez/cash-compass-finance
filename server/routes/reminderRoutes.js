const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const reminders = await Reminder.find({ user: req.user._id }).sort({
      isRead: 1,
      createdAt: -1,
    });
    res.json(reminders.map((reminder) => reminder.toClient()));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, message, type, date } = req.body;

    if (!title || !message) {
      throw createError(400, "Reminder title and message are required.");
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      title,
      message,
      type: type || "info",
      date: date || new Date().toISOString(),
    });

    res.status(201).json(reminder.toClient());
  })
);

router.patch(
  "/read-all",
  asyncHandler(async (req, res) => {
    await Reminder.updateMany({ user: req.user._id }, { $set: { isRead: true } });
    const reminders = await Reminder.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(reminders.map((reminder) => reminder.toClient()));
  })
);

router.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!reminder) {
      throw createError(404, "Reminder not found.");
    }

    res.json(reminder.toClient());
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      throw createError(404, "Reminder not found.");
    }

    res.json({ success: true, id: deleted._id.toString() });
  })
);

module.exports = router;
