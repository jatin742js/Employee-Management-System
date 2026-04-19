require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { globalErrorHandler } = require("./utils/errorHandler");

// Import routes
const adminAuthRoutes = require("./routes/adminAuth");
const employeeAuthRoutes = require("./routes/employeeAuth");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/employee/auth", employeeAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Employee Management System Backend",
    status: "running",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
