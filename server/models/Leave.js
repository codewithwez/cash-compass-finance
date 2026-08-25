const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, trim: true, default: "Vacation" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },
  },
  { timestamps: true }
);

leaveSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    type: this.type,
    startDate: this.startDate,
    endDate: this.endDate,
    days: this.days,
    status: this.status,
  };
};

module.exports = mongoose.model("Leave", leaveSchema);
