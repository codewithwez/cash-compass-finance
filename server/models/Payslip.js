const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    period: { type: String, required: true },
    date: { type: String, required: true },
    netPay: { type: Number, required: true, min: 0 },
    status: { type: String, default: "Paid" },
    fileUrl: { type: String, required: false }, // PDF or Image Data URL / Path
  },
  { timestamps: true }
);

payslipSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    period: this.period,
    date: this.date,
    netPay: this.netPay,
    status: this.status,
    fileUrl: this.fileUrl || "",
  };
};

module.exports = mongoose.model("Payslip", payslipSchema,"payslips");