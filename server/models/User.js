const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const makePublicId = (role) => {
  const prefix =
    role === "Admin" ? "ADM" : role === "Employee" ? "EMP" : "STU";
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

const expensePolicySchema = new mongoose.Schema(
  {
    limit: { type: Number, default: 1000, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    department: { type: String, default: "General" },
    position: { type: String, default: "Employee" },
    monthlySalary: { type: Number, default: 6240, min: 0 },
    nextPayDate: { type: String, default: "" },
    expensePolicy: { type: expensePolicySchema, default: () => ({}) },
  },
  { _id: false }
);

const ptoSchema = new mongoose.Schema(
  {
    availableDays: { type: Number, default: 0, min: 0 },
    usedDays: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    publicId: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    role: {
      type: String,
      enum: ["Student", "Employee", "Admin"],
      default: "Student",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: { type: String, default: "" },
    picture: { type: String, default: "" },
    monthlyAllowance: { type: Number, default: 0, min: 0 },
    employee: { type: employeeSchema, default: () => ({}) },
    pto: { type: ptoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.pre("validate", function setPublicId() {
  if (!this.publicId) {
    this.publicId = makePublicId(this.role);
  }
});

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toClient = function toClient() {
  const employee = this.employee || {};
  const expensePolicy = employee.expensePolicy || {};
  const pto = this.pto || {};

  return {
    id: this.publicId || this._id.toString(),
    databaseId: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    picture: this.picture || null,
    monthlyAllowance: this.monthlyAllowance || 0,
    allowance: this.monthlyAllowance || 0,
    department: employee.department || "",
    position: employee.position || "",
    monthlySalary: employee.monthlySalary || 0,
    nextPayDate: employee.nextPayDate || "",
    expensePolicy: {
      limit: expensePolicy.limit || 0,
      spent: expensePolicy.spent || 0,
    },
    pto: {
      availableDays: pto.availableDays || 0,
      usedDays: pto.usedDays || 0,
    },
  };
};

module.exports = mongoose.model("User", userSchema);
