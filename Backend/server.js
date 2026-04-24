require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/database");
const { globalErrorHandler } = require("./utils/errorHandler");
const { initializeSocket } = require("./utils/socketEmitter");

// Import routes
const adminAuthRoutes = require("./routes/adminAuth");
const employeeAuthRoutes = require("./routes/employeeAuth");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Admin joins their room
  socket.on("admin:join", (adminId) => {
    socket.join(`admin:${adminId}`);
    console.log(`Admin ${adminId} joined their room`);
  });

  // Employee joins their room
  socket.on("employee:join", (employeeId) => {
    socket.join(`employee:${employeeId}`);
    console.log(`Employee ${employeeId} joined their room`);
  });

  // Broadcast to admin dashboard
  socket.on("admin:joinDashboard", (adminId) => {
    socket.join(`admin:dashboard:${adminId}`);
    console.log(`Admin ${adminId} joined dashboard room`);
  });

  // Broadcast to employee dashboard
  socket.on("employee:joinDashboard", (employeeId) => {
    socket.join(`employee:dashboard:${employeeId}`);
    console.log(`Employee ${employeeId} joined dashboard room`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set("io", io);

// Initialize socket emitter
initializeSocket(io);

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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Socket.io initialized for CORS origin: ${process.env.FRONTEND_URL || "http://localhost:5174"}`);
});

// Allow port reuse immediately after crash
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Retrying in 3 seconds...`);
    setTimeout(() => {
      server.close();
      process.exit(1);
    }, 3000);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, io, server };
