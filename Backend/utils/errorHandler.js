// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler to wrap controllers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong ID error
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new AppError(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    err = new AppError(message, 400);
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    err = new AppError(message, 401);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    err = new AppError(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  AppError,
  asyncHandler,
  globalErrorHandler,
};
