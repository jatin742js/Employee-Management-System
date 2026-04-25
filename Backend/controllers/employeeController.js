const AttendanceService = require("../services/attendanceService");
const LeaveService = require("../services/leaveService");
const PayrollService = require("../services/payrollService");
const EmployeeAuthService = require("../services/employeeAuthService");
const NotificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const { asyncHandler } = require("../utils/errorHandler");
const { getCurrentMonth } = require("../utils/helpers");

// ============ ATTENDANCE ============

// @route   GET /api/employee/attendance
// @desc    Get my attendance records
// @access  Private/Employee
exports.getMyAttendance = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.query;
  let filters = { employee: req.user.id };

  if (fromDate && toDate) {
    const attendance = await AttendanceService.getAttendanceByDateRange(
      req.user.id,
      fromDate,
      toDate
    );

    return successResponse(res, 200, "Attendance records retrieved", {
      count: attendance.length,
      attendance,
    });
  }

  const attendance = await AttendanceService.getEmployeeAttendance(
    req.user.id,
    filters
  );

  successResponse(res, 200, "Attendance records retrieved", {
    count: attendance.length,
    attendance,
  });
});

// @route   POST /api/employee/attendance/check-in
// @desc    Check in
// @access  Private/Employee
exports.checkIn = asyncHandler(async (req, res) => {
  const attendance = await AttendanceService.checkIn(req.user.id);

  successResponse(res, 200, "Checked in successfully", attendance);
});

// @route   POST /api/employee/attendance/check-out
// @desc    Check out
// @access  Private/Employee
exports.checkOut = asyncHandler(async (req, res) => {
  const attendance = await AttendanceService.checkOut(req.user.id);

  successResponse(res, 200, "Checked out successfully", attendance);
});

// ============ LEAVES ============

// @route   GET /api/employee/leaves
// @desc    Get my leave requests
// @access  Private/Employee
exports.getMyLeaves = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let filters = {};

  if (status) filters.status = status;

  const leaves = await LeaveService.getEmployeeLeaves(req.user.id, filters);

  successResponse(res, 200, "Leave requests retrieved", {
    count: leaves.length,
    leaves,
  });
});

// @route   POST /api/employee/leaves
// @desc    Request leave
// @access  Private/Employee
exports.requestLeave = asyncHandler(async (req, res) => {
  const {
    leaveType,
    startDate,
    endDate,
    numberOfDays,
    reason,
  } = req.body;

  const leave = await LeaveService.requestLeave({
    employee: req.user.id,
    leaveType,
    startDate,
    endDate,
    numberOfDays,
    reason,
  });

  successResponse(res, 201, "Leave request submitted successfully", leave);
});

// @route   DELETE /api/employee/leaves/:id
// @desc    Cancel leave request
// @access  Private/Employee
exports.cancelLeave = asyncHandler(async (req, res) => {
  const result = await LeaveService.cancelLeave(req.params.id, req.user.id);

  successResponse(res, 200, result.message);
});

// ============ PAYROLL ============

// @route   GET /api/employee/payroll
// @desc    Get my payroll records
// @access  Private/Employee
exports.getMyPayroll = asyncHandler(async (req, res) => {
  const { month } = req.query;
  let filters = {};

  if (month) filters.month = month;

  const payroll = await PayrollService.getEmployeePayroll(req.user.id, filters);

  successResponse(res, 200, "Payroll records retrieved", {
    count: payroll.length,
    payroll,
  });
});

// @route   GET /api/employee/payroll/:id
// @desc    Get payroll details
// @access  Private/Employee
exports.getPayrollDetails = asyncHandler(async (req, res) => {
  const payroll = await PayrollService.getPayrollById(req.params.id, req.user.id);

  successResponse(res, 200, "Payroll retrieved successfully", payroll);
});

// ============ DASHBOARD ============

// @route   GET /api/employee/dashboard/stats
// @desc    Get employee dashboard statistics
// @access  Private/Employee
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const employee = await EmployeeAuthService.getEmployeeProfile(req.user.id);

  const { $gte, $lt } = require("../utils/helpers").getTodayRange();

  // Get today's attendance
  const todayAttendance = await AttendanceService.getEmployeeAttendance(
    req.user.id,
    {
      date: { $gte, $lt },
    }
  );

  // Get leave statistics
  const pendingLeaves = await LeaveService.getEmployeeLeaves(req.user.id, {
    status: "pending",
  });

  const approvedLeaves = await LeaveService.getEmployeeLeaves(req.user.id, {
    status: "approved",
  });

  // Get current month payroll
  const currentMonth = getCurrentMonth();
  const currentPayroll = await PayrollService.getEmployeePayroll(req.user.id, {
    month: currentMonth,
  });

  successResponse(res, 200, "Dashboard stats retrieved", {
    employee: {
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      position: employee.position,
      email: employee.email,
    },
    todayAttendance: todayAttendance[0] || null,
    pendingLeaves: pendingLeaves.length,
    approvedLeaves: approvedLeaves.length,
    currentPayroll: currentPayroll[0] || null,
  });
});

// @route   GET /api/employee/notifications
// @desc    Get my notifications
// @access  Private/Employee
exports.getMyNotifications = asyncHandler(async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const notifications = await NotificationService.getEmployeeNotifications(req.user.id);
  const paginated = notifications.slice(Number(skip), Number(skip) + Number(limit));

  successResponse(res, 200, "Notifications retrieved", {
    count: paginated.length,
    total: notifications.length,
    notifications: paginated,
  });
});
