const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["warning", "info"],
      default: "info",
    },
    date: { type: String, default: () => new Date().toISOString() },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reminderSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    title: this.title,
    message: this.message,
    type: this.type,
    date: this.date,
    isRead: this.isRead,
  };
};

module.exports = mongoose.model("Reminder", reminderSchema);
