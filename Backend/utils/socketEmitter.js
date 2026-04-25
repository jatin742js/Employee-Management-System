// Socket.io Event Emitter Utility
// Used to emit real-time events from services and controllers

let io = null;

// Initialize with io instance from server
const initializeSocket = (ioInstance) => {
  io = ioInstance;
};

// Get io instance
const getIO = () => {
  if (!io) {
    console.warn('Socket.io not initialized yet');
  }
  return io;
};

// Emit event to specific admin
const emitToAdmin = (adminId, event, data) => {
  if (io) {
    io
      .to(`admin:${adminId}`)
      .to(`admin:dashboard:${adminId}`)
      .emit(event, data);
  }
};

// Emit event to specific employee
const emitToEmployee = (employeeId, event, data) => {
  if (io) {
    io
      .to(`employee:${employeeId}`)
      .to(`employee:dashboard:${employeeId}`)
      .emit(event, data);
  }
};

// Emit event to all admins
const emitToAllAdmins = (event, data) => {
  if (io) {
    io.emit(`admin:${event}`, data);
  }
};

// Emit event to all employees
const emitToAllEmployees = (event, data) => {
  if (io) {
    io.emit(`employee:${event}`, data);
  }
};

// Emit event to specific admin dashboard
const emitToAdminDashboard = (adminId, event, data) => {
  if (io) {
    io.to(`admin:dashboard:${adminId}`).emit(event, data);
  }
};

// Emit event to specific employee dashboard
const emitToEmployeeDashboard = (employeeId, event, data) => {
  if (io) {
    io.to(`employee:dashboard:${employeeId}`).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToAdmin,
  emitToEmployee,
  emitToAllAdmins,
  emitToAllEmployees,
  emitToAdminDashboard,
  emitToEmployeeDashboard,
};
