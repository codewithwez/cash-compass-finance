const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { sendPasswordResetEmail } = require("../utils/email");
const { protect, signToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
} = require("../validators/authValidator");

const validRoles = ["Student", "Employee", "Admin"];
const normalizeRole = (role) => (validRoles.includes(role) ? role : "Student");

const authPayload = (user) => ({
  success: true,
  token: signToken(user),
  user: user.toClient(),
});

const adminEmail = () =>
  (process.env.ADMIN_EMAIL || "admin@cashcompass.com").toLowerCase();
const adminPassword = () => process.env.ADMIN_PASSWORD || "admin123password";

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user?.password) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetTokenHash = hashResetToken(resetToken);
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      await sendPasswordResetEmail(user, resetToken);
    }

    res.json({
      success: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  })
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+password +passwordResetTokenHash +passwordResetExpiresAt");

    if (!user) {
      throw createError(
        400,
        "This password reset link is invalid or has expired."
      );
    }

    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  })
);

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role, picture } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      throw createError(409, "An account with this email already exists.");
    }

    const normalizedRole = normalizeRole(role);
    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
      picture: picture || "",
      monthlyAllowance:
        normalizedRole === "Student"
          ? Number(req.body.monthlyAllowance ?? 500)
          : 0,
      employee:
        normalizedRole === "Employee"
          ? {
              department: req.body.department || "General",
              position: req.body.position || "Employee",
              monthlySalary: Number(req.body.monthlySalary ?? 0),
              nextPayDate: req.body.nextPayDate || "",
              expensePolicy: {
                limit: Number(req.body.expenseLimit ?? 0),
                spent: 0,
              },
            }
          : undefined,
    });

    res.status(201).json(authPayload(user));
  })
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email === adminEmail()) {
      let admin = await User.findOne({ email }).select("+password");

      if (!admin) {
        admin = await User.create({
          name: "CashCompass Admin",
          email,
          password: adminPassword(),
          role: "Admin",
          status: "Active",
          monthlyAllowance: 0,
        });
        admin = await User.findById(admin._id).select("+password");
      }

      const isAdminValid = await admin.matchPassword(password);
      if (!isAdminValid) {
        throw createError(401, "Invalid admin credentials.");
      }

      return res.json(authPayload(admin));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      throw createError(401, "Invalid email or password.");
    }

    res.json(authPayload(user));
  })
);

router.post(
  "/google",
  asyncHandler(async (req, res) => {
    const { email, name, picture, role, googleId } = req.body;

    if (!email) {
      throw createError(400, "Google email is required.");
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: normalizeRole(role),
        provider: "google",
        googleId: googleId || "",
        picture: picture || "",
        monthlyAllowance: normalizeRole(role) === "Student" ? 500 : 0,
      });
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.provider = user.provider || "google";
      user.googleId = googleId || user.googleId;
      await user.save();
    }

    res.json(authPayload(user));
  })
);

router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user.toClient() });
  })
);

router.patch(
  "/profile",
  protect,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const { name, picture, monthlyAllowance, department, position, nextPayDate } =
      req.body;

    if (name !== undefined) req.user.name = name;
    if (picture !== undefined) req.user.picture = picture;
    if (monthlyAllowance !== undefined && req.user.role === "Student") {
      req.user.monthlyAllowance = Number(monthlyAllowance);
    }

    if (req.user.role === "Employee") {
      if (department !== undefined) req.user.employee.department = department;
      if (position !== undefined) req.user.employee.position = position;
      if (nextPayDate !== undefined) req.user.employee.nextPayDate = nextPayDate;
    }

    await req.user.save();
    res.json({ success: true, user: req.user.toClient() });
  })
);

router.patch(
  "/password",
  protect,
  validate(updatePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user || !(await user.matchPassword(currentPassword))) {
      throw createError(401, "Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  })
);

module.exports = router;
