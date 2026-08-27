const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, trim: true, required: true },
    category: { type: String, trim: true, default: "General" },
    limit: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      default: "monthly",
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

budgetSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    name: this.name,
    category: this.category,
    limit: this.limit,
    spent: this.spent,
    period: this.period,
    startDate: this.startDate ? this.startDate.toISOString() : null,
    endDate: this.endDate ? this.endDate.toISOString() : null,
  };
};

module.exports = mongoose.model("Budget", budgetSchema,"budgets");
