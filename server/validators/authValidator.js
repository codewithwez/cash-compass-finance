const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Invalid email address format").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["Student", "Employee", "Admin"]).optional().default("Student"),
  picture: z.string().trim().optional().or(z.literal("")),
  monthlyAllowance: z.coerce.number().nonnegative().optional(),
  department: z.string().trim().optional().or(z.literal("")),
  position: z.string().trim().optional().or(z.literal("")),
  monthlySalary: z.coerce.number().nonnegative().optional(),
  nextPayDate: z.string().trim().optional().or(z.literal("")),
  expenseLimit: z.coerce.number().nonnegative().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address format").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address format").toLowerCase(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
  picture: z.string().trim().optional().or(z.literal("")),
  monthlyAllowance: z.coerce.number().nonnegative().optional(),
  department: z.string().trim().optional().or(z.literal("")),
  position: z.string().trim().optional().or(z.literal("")),
  nextPayDate: z.string().trim().optional().or(z.literal("")),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
};
