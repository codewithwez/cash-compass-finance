const { z } = require("zod");

const createLeaveSchema = z.object({
  days: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .int("Leave days must be a whole number.")
      .positive("Leave days must be greater than zero.")
  ),
  type: z.enum(["Vacation", "Sick Leave", "Personal", "Unpaid"], {
    errorMap: () => ({ message: "Invalid leave type selected." }),
  }).optional().default("Vacation"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format.")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format.")
    .optional(),
  status: z.enum(["Pending", "Approved", "Rejected"]).optional().default("Approved"),
});

const updateLeaveStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"], {
    errorMap: () => ({ message: "Invalid leave status." }),
  }),
});

const leaveIdSchema = z.object({
  id: z.string().min(1, "Leave id is required."),
});

module.exports = {
  createLeaveSchema,
  updateLeaveStatusSchema,
  leaveIdSchema,
};
