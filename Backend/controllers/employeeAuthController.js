const EmployeeAuthService = require("../services/employeeAuthService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const { asyncHandler } = require("../utils/errorHandler");

// @route   POST /api/employee/auth/register
// @desc    Register new employee
// @access  Public
exports.registerEmployee = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    employeeId,
    department,
    position,
    salary,
    dateOfJoining,
  } = req.body;

  const result = await EmployeeAuthService.registerEmployee({
    name,
    email,
    password,
    phone,
    employeeId,
    department,
    position,
    salary,
    dateOfJoining,
  });

  successResponse(res, 201, "Employee registered successfully", result);
});

// @route   POST /api/employee/auth/login
// @desc    Login employee
// @access  Public
exports.loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await EmployeeAuthService.loginEmployee(email, password);

  successResponse(res, 200, "Login successful", result);
});

// @route   GET /api/employee/auth/profile
// @desc    Get employee profile
// @access  Private/Employee
exports.getEmployeeProfile = asyncHandler(async (req, res) => {
  const employee = await EmployeeAuthService.getEmployeeProfile(req.user.id);

  successResponse(res, 200, "Profile retrieved successfully", employee);
});

// @route   PUT /api/employee/auth/profile
// @desc    Update employee profile
// @access  Private/Employee
exports.updateEmployeeProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const employee = await EmployeeAuthService.updateEmployeeProfile(
    req.user.id,
    { name, phone, address }
  );

  successResponse(res, 200, "Profile updated successfully", employee);
});

// @route   PUT /api/employee/auth/change-password
// @desc    Change employee password
// @access  Private/Employee
exports.changeEmployeePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return errorResponse(res, 400, "Passwords do not match");
  }

  const result = await EmployeeAuthService.changeEmployeePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  successResponse(res, 200, result.message);
});
