const EmployeeService = require("../services/employeeService");
const AttendanceService = require("../services/attendanceService");
const LeaveService = require("../services/leaveService");
const PayrollService = require("../services/payrollService");
const NotificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const { asyncHandler } = require("../utils/errorHandler");
const { emitToAdmin, emitToEmployee } = require("../utils/socketEmitter");

// ============ EMPLOYEE MANAGEMENT ============

// @route   GET /api/admin/employees
// @desc    Get all employees
// @access  Private/Admin
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const { department, position } = req.query;
  const filters = {};

  if (department) filters.department = department;
  if (position) filters.position = position;

  const employees = await EmployeeService.getAllEmployees(filters);

  successResponse(res, 200, "Employees retrieved successfully", {
    count: employees.length,
    employees,
  });
});

// @route   GET /api/admin/employees/:id
// @desc    Get single employee (includes password for admin viewing)
// @access  Private/Admin
exports.getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.getEmployeeById(req.params.id);

  successResponse(res, 200, "Employee retrieved successfully", employee);
  // Note: Password is included for admin viewing in details/edit modal
});

// @route   POST /api/admin/employees
// @desc    Create new employee
// @access  Private/Admin
exports.createEmployee = asyncHandler(async (req, res) => {
  const result = await EmployeeService.createEmployee(req.body);

  successResponse(res, 201, "Employee created successfully", result);
});

// @route   PUT /api/admin/employees/:id
// @desc    Update employee
// @access  Private/Admin
exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.updateEmployee(req.params.id, req.body);

  successResponse(res, 200, "Employee updated successfully", employee);
});

// @route   PUT /api/admin/employees/:id/deactivate
// @desc    Deactivate employee
// @access  Private/Admin
exports.deactivateEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.deactivateEmployee(req.params.id);

  successResponse(res, 200, "Employee deactivated successfully", employee);
});

// @route   PUT /api/admin/employees/:id/activate
// @desc    Activate employee
// @access  Private/Admin
exports.activateEmployee = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.activateEmployee(req.params.id);

  successResponse(res, 200, "Employee activated successfully", employee);
});

// @route   DELETE /api/admin/employees/:id
// @desc    Delete employee permanently
// @access  Private/Admin
exports.deleteEmployee = asyncHandler(async (req, res) => {
  const result = await EmployeeService.deleteEmployee(req.params.id);

  successResponse(res, 200, "Employee deleted successfully", result);
});

// ============ ATTENDANCE MANAGEMENT ============

// @route   GET /api/admin/attendance
// @desc    Get attendance records
// @access  Private/Admin
exports.getAttendance = asyncHandler(async (req, res) => {
  const { employeeId, fromDate, toDate } = req.query;
  let filters = {};

  if (employeeId) filters.employee = employeeId;

  if (fromDate && toDate) {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    filters.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const attendance = await AttendanceService.getAttendance(filters);

  successResponse(res, 200, "Attendance records retrieved successfully", {
    count: attendance.length,
    attendance,
  });
});

// @route   POST /api/admin/attendance
// @desc    Record attendance
// @access  Private/Admin
exports.recordAttendance = asyncHandler(async (req, res) => {
  const attendance = await AttendanceService.recordAttendance(req.body);

  successResponse(res, 201, "Attendance recorded successfully", attendance);
});

// ============ LEAVE MANAGEMENT ============

// @route   GET /api/admin/leaves
// @desc    Get all leave requests
// @access  Private/Admin
exports.getAllLeaves = asyncHandler(async (req, res) => {
  const { status, employeeId } = req.query;
  let filters = {};

  if (status) filters.status = status;
  if (employeeId) filters.employee = employeeId;

  const leaves = await LeaveService.getAllLeaves(filters);

  successResponse(res, 200, "Leave requests retrieved successfully", {
    count: leaves.length,
    leaves,
  });
});

// @route   PUT /api/admin/leaves/:id/approve
// @desc    Approve leave request
// @access  Private/Admin
exports.approveLeave = asyncHandler(async (req, res) => {
  const leave = await LeaveService.approveLeave(req.params.id, req.user.id);

  successResponse(res, 200, "Leave approved successfully", leave);
});

// @route   PUT /api/admin/leaves/:id/reject
// @desc    Reject leave request
// @access  Private/Admin
exports.rejectLeave = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const leave = await LeaveService.rejectLeave(
    req.params.id,
    rejectionReason,
    req.user.id
  );

  successResponse(res, 200, "Leave rejected successfully", leave);
});

// ============ PAYROLL MANAGEMENT ============

// @route   GET /api/admin/payroll
// @desc    Get payroll records
// @access  Private/Admin
exports.getAllPayroll = asyncHandler(async (req, res) => {
  const { employeeId, month } = req.query;
  let filters = {};

  if (employeeId) filters.employee = employeeId;
  if (month) filters.month = month;

  const payroll = await PayrollService.getAllPayroll(filters);

  successResponse(res, 200, "Payroll records retrieved successfully", {
    count: payroll.length,
    payroll,
  });
});

// @route   POST /api/admin/payroll
// @desc    Create payroll record
// @access  Private/Admin
exports.createPayroll = asyncHandler(async (req, res) => {
  const payroll = await PayrollService.createPayroll(req.body, req.user.id);

  successResponse(res, 201, "Payroll created successfully", payroll);
});

// @route   PUT /api/admin/payroll/:id/status
// @desc    Update payroll status
// @access  Private/Admin
exports.updatePayrollStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentDate } = req.body;

  const payroll = await PayrollService.updatePayrollStatus(
    req.params.id,
    paymentStatus,
    paymentDate
  );

  successResponse(res, 200, "Payroll status updated successfully", payroll);
});

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalEmployees = await EmployeeService.getTotalEmployeesCount();
  const departmentsCount = await EmployeeService.getDepartmentsCount();
  const todayAttendance = await AttendanceService.getTodayAttendanceCount();
  const pendingLeaves = await LeaveService.getPendingLeavesCount();

  successResponse(res, 200, "Dashboard stats retrieved successfully", {
    totalEmployees,
    departmentsCount,
    todayAttendance,
    pendingLeaves,
  });
});

// ============ NOTIFICATION MANAGEMENT ============

// @route   GET /api/admin/notifications
// @desc    Get admin notifications
// @access  Private/Admin
exports.getNotifications = asyncHandler(async (req, res) => {
  const { limit = 10, skip = 0, unreadOnly = false } = req.query;
  let notifications;

  if (unreadOnly === 'true') {
    notifications = await NotificationService.getUnreadNotifications(req.user.id);
  } else {
    notifications = await NotificationService.getAdminNotifications(req.user.id);
  }

  const paginated = notifications.slice(skip, skip + limit);

  successResponse(res, 200, "Notifications retrieved successfully", {
    count: paginated.length,
    total: notifications.length,
    notifications: paginated,
  });
});

// @route   GET /api/admin/notifications/unread/count
// @desc    Get unread notifications count
// @access  Private/Admin
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await NotificationService.getUnreadCount(req.user.id);

  successResponse(res, 200, "Unread count retrieved successfully", { count });
});

// @route   PUT /api/admin/notifications/:id/read
// @desc    Mark notification as read
// @access  Private/Admin
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id);

  successResponse(res, 200, "Notification marked as read", notification);
});

// @route   PUT /api/admin/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private/Admin
exports.markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const result = await NotificationService.markAllAsRead(req.user.id);

  successResponse(res, 200, "All notifications marked as read", result);
});

// @route   DELETE /api/admin/notifications/:id
// @desc    Delete notification
// @access  Private/Admin
exports.deleteNotification = asyncHandler(async (req, res) => {
  const result = await NotificationService.deleteNotification(req.params.id);

  successResponse(res, 200, "Notification deleted successfully", result);
});

// @route   POST /api/admin/notifications/send
// @desc    Send notification to a specific employee
// @access  Private/Admin
exports.sendNotification = asyncHandler(async (req, res) => {
  const { employeeId, title, message } = req.body;

  const notification = await NotificationService.createNotification({
    admin: req.user.id,
    employee: employeeId,
    type: "general",
    title,
    message,
    description: "",
  });

  emitToEmployee(String(employeeId), "notification:received", {
    _id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
  });

  emitToAdmin(String(req.user.id), "notification:sent", {
    _id: notification._id,
    employeeId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
  });

  successResponse(res, 201, "Notification sent successfully", notification);
});
