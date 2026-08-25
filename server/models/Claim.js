const mongoose = require("mongoose");

const makeClaimId = () =>
  `CLM-${Math.floor(100000 + Math.random() * 900000)}`;

const claimSchema = new mongoose.Schema(
  {
    publicId: { type: String, unique: true, index: true },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employeeName: { type: String, trim: true, default: "" },
    employeeEmail: { type: String, trim: true, default: "" },
    employeePublicId: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "General" },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    receiptType: { type: String, trim: true, default: "PDF" },
    receiptUrl: { type: String, trim: true, default: "" },
    requestedDate: { type: String, default: () => new Date().toISOString() },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

claimSchema.pre("validate", function setPublicId() {
  if (!this.publicId) {
    this.publicId = makeClaimId();
  }
});

claimSchema.methods.toClient = function toClient() {
  const title = this.title || this.description || "Expense Claim";

  return {
    id: this.publicId || this._id.toString(),
    databaseId: this._id.toString(),
    employeeId: this.employeePublicId,
    employee: this.employeeName,
    employeeName: this.employeeName,
    employeeEmail: this.employeeEmail,
    department: this.department,
    role: this.role,
    title,
    description: this.description || title,
    category: this.category,
    amount: this.amount,
    status: this.status,
    date: this.requestedDate,
    requestedDate: this.requestedDate,
    receiptType: this.receiptType,
    receiptUrl: this.receiptUrl || null,
    receiptAttached: Boolean(this.receiptUrl),
  };
};

module.exports = mongoose.model("Claim", claimSchema);
