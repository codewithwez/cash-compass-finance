const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createError = require("../utils/httpError");

const jwtSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    throw createError(500, "JWT_SECRET is required in production.");
  }

  return process.env.JWT_SECRET || "cashcompass-dev-secret";
};

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    throw createError(401, "Not authorized. Please sign in.");
  }

  const decoded = jwt.verify(token, jwtSecret());
  const user = await User.findById(decoded.id);

  if (!user) {
    throw createError(401, "Not authorized. User no longer exists.");
  }

  if (user.status === "Inactive") {
    throw createError(403, "This account is inactive.");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw createError(403, "You do not have permission for this action.");
  }

  next();
};
 
module.exports = { protect, authorize, signToken };
