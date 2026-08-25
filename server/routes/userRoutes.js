const express = require("express");
const router = express.Router();
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");
const { protect, authorize } = require("../middleware/authMiddleware");
const { clientIdFilter } = require("../utils/clientId");

router.use(protect);
router.use(authorize("Admin"));

const defaultPassword = () => process.env.DEFAULT_USER_PASSWORD || "CashCompass123";

const listUsers = async (role) =>
  User.find({ role }).sort({ createdAt: -1 }).then((users) =>
    users.map((user) => user.toClient())
  );

const findManagedUser = async (role, id) =>
  User.findOne({ role, $or: clientIdFilter(id) });

router.get(
  "/students",
  asyncHandler(async (req, res) => {
    res.json(await listUsers("Student"));
  })
);

router.post(
  "/students",
  asyncHandler(async (req, res) => {
    const { name, email, allowance, status } = req.body;

    if (!name || !email) {
      throw createError(400, "Student name and email are required.");
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      throw createError(409, "A user with this email already exists.");
    }

    const student = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: req.body.password || defaultPassword(),
      role: "Student",
      status: status || "Active",
      monthlyAllowance: Number(allowance ?? req.body.monthlyAllowance ?? 0),
    });

    res.status(201).json(student.toClient());
  })
);

router.patch(
  "/students/:id",
  asyncHandler(async (req, res) => {
    const student = await findManagedUser("Student", req.params.id);

    if (!student) {
      throw createError(404, "Student not found.");
    }

    if (req.body.name !== undefined) student.name = req.body.name;
    if (req.body.email !== undefined) student.email = String(req.body.email).toLowerCase();
    if (req.body.status !== undefined) student.status = req.body.status;
    if (req.body.allowance !== undefined) student.monthlyAllowance = Number(req.body.allowance);
    if (req.body.monthlyAllowance !== undefined) {
      student.monthlyAllowance = Number(req.body.monthlyAllowance);
    }

    await student.save();
    res.json(student.toClient());
  })
);

router.delete(
  "/students/:id",
  asyncHandler(async (req, res) => {
    const deleted = await User.findOneAndDelete({
      role: "Student",
      $or: clientIdFilter(req.params.id),
    });

    if (!deleted) {
      throw createError(404, "Student not found.");
    }

    res.json({ success: true, id: deleted.publicId || deleted._id.toString() });
  })
);

router.get(
  "/employees",
  asyncHandler(async (req, res) => {
    res.json(await listUsers("Employee"));
  })
);

router.post(
  "/employees",
  asyncHandler(async (req, res) => {
    const { name, email, department, role, status } = req.body;

    if (!name || !email) {
      throw createError(400, "Employee name and email are required.");
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      throw createError(409, "A user with this email already exists.");
    }

    const employee = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: req.body.password || defaultPassword(),
      role: "Employee",
      status: status || "Active",
      monthlyAllowance: 0,
      employee: {
        department: department || "General",
        position: role || req.body.position || "Employee",
        monthlySalary: Number(req.body.monthlySalary ?? 0),
        nextPayDate: req.body.nextPayDate || "",
        expensePolicy: {
          limit: Number(req.body.expenseLimit ?? 0),
          spent: 0,
        },
      },
    });

    res.status(201).json(employee.toClient());
  })
);

router.patch(
  "/employees/:id",
  asyncHandler(async (req, res) => {
    const employee = await findManagedUser("Employee", req.params.id);

    if (!employee) {
      throw createError(404, "Employee not found.");
    }

    if (req.body.name !== undefined) employee.name = req.body.name;
    if (req.body.email !== undefined) employee.email = String(req.body.email).toLowerCase();
    if (req.body.status !== undefined) employee.status = req.body.status;
    if (req.body.department !== undefined) employee.employee.department = req.body.department;
    if (req.body.role !== undefined) employee.employee.position = req.body.role;
    if (req.body.position !== undefined) employee.employee.position = req.body.position;
    if (req.body.monthlySalary !== undefined) {
      employee.employee.monthlySalary = Number(req.body.monthlySalary);
    }
    if (req.body.nextPayDate !== undefined) employee.employee.nextPayDate = req.body.nextPayDate;
    if (req.body.totalLeave !== undefined) {
      const totalLeave = Number(req.body.totalLeave);
      const usedDays = employee.pto?.usedDays || 0;

      if (!Number.isFinite(totalLeave) || totalLeave < usedDays) {
        throw createError(400, `Total leave must be at least ${usedDays} used day(s).`);
      }

      employee.pto.availableDays = totalLeave - usedDays;
    }

    await employee.save();
    res.json(employee.toClient());
  })
);

router.delete(
  "/employees/:id",
  asyncHandler(async (req, res) => {
    const deleted = await User.findOneAndDelete({
      role: "Employee",
      $or: clientIdFilter(req.params.id),
    });

    if (!deleted) {
      throw createError(404, "Employee not found.");
    }

    res.json({ success: true, id: deleted.publicId || deleted._id.toString() });
  })
);

module.exports = router;
