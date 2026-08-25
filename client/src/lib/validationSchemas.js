import { z } from "zod";

const requiredText = (label, min = 1) =>
  z.string().trim().min(min, `${label} must be at least ${min} character${min === 1 ? "" : "s"}.`);

const positiveAmount = z.coerce.number().positive("Amount must be greater than 0.");

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmation: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Passwords do not match.",
    path: ["confirmation"],
  });

export const upcomingExpenseSchema = z.object({
  title: requiredText("Title", 2),
  amount: positiveAmount,
  category: requiredText("Category"),
  dueDate: z.string().min(1, "Due date is required."),
});

export const depositSchema = z.object({
  amount: positiveAmount,
  source: requiredText("Source"),
  notes: z.string().trim().max(200, "Notes must be 200 characters or fewer."),
});

export const expenseSchema = z.object({
  title: requiredText("Description", 2),
  amount: positiveAmount,
  category: requiredText("Category"),
  period: z.enum(["this_week", "this_month"]),
});

export const profileNameSchema = z.object({
  name: requiredText("Name", 3),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const employeeExpenseSchema = z.object({
  title: requiredText("Expense title", 2),
  amount: positiveAmount,
  category: requiredText("Category"),
  type: z.enum(["Work", "Personal"]),
});

export const claimSchema = z.object({
  description: requiredText("Description", 2),
  amount: positiveAmount,
  category: requiredText("Category"),
});

export const leaveSchema = z.object({
  leaveDays: z.coerce.number().int().positive("Enter a valid number of days."),
  leaveType: requiredText("Leave type"),
});

export const salarySchema = z.object({
  salary: z.coerce.number().positive("Salary must be greater than 0."),
});

export const employeeProfileSchema = z.object({
  name: requiredText("Name", 3),
  role: requiredText("Role", 2),
  department: requiredText("Department", 2),
  email: z.string().trim().email("Enter a valid email address."),
});

export const adminStudentSchema = z.object({
  name: requiredText("Name", 3),
  email: z.string().trim().email("Enter a valid email address."),
  allowance: z.coerce.number().min(0, "Allowance cannot be negative."),
  status: z.enum(["Active", "Inactive"]),
});

export const adminPayrollSchema = z.object({
  monthlySalary: z.coerce.number().positive("Salary must be greater than 0."),
  nextPayDate: z.string().optional(),
});

export const adminLeaveSchema = z.object({
  totalLeave: z.coerce.number().nonnegative("Leave days cannot be negative."),
});

export const getValidationMessage = (result) =>
  result.success ? "" : result.error.issues[0]?.message || "Please check the form.";
