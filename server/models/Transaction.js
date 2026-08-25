const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["expense", "deposit", "upcoming"],
      required: true,
      index: true,
    },
    title: { type: String, trim: true, default: "" },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true, default: "Other" },
    period: { type: String, trim: true, default: "this_week" },
    date: { type: Date, default: Date.now },
    source: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    dueDate: { type: String, trim: true, default: "" },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    type: this.type,
    title: this.title,
    amount: this.amount,
    category: this.category,
    period: this.period,
    date: this.date ? this.date.toISOString() : null,
    source: this.source,
    notes: this.notes,
    dueDate: this.dueDate,
    isPaid: this.isPaid,
  };
};

module.exports = mongoose.model("Transaction", transactionSchema);
