const validate = (schema) => (req, res, next) => {
  try {
    // Safely parse req.body (or default to empty object if undefined)
    req.body = schema.parse(req.body || {});
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.issues) {
      const formattedErrors = (error.issues || error.errors || []).map((err) => ({
        field: err.path.join(".") || "body",
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

module.exports = validate;