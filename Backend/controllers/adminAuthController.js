const AdminAuthService = require("../services/adminAuthService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const { asyncHandler } = require("../utils/errorHandler");

// @route   POST /api/admin/auth/register
// @desc    Register new admin
// @access  Public
exports.registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone, department, organization } = req.body;

  const result = await AdminAuthService.registerAdmin({
    name,
    email,
    password,
    phone,
    department,
    organization,
  });

  successResponse(res, 201, "Admin registered successfully", result);
});

// @route   POST /api/admin/auth/login
// @desc    Login admin
// @access  Public
exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await AdminAuthService.loginAdmin(email, password);

  successResponse(res, 200, "Login successful", result);
});

// @route   GET /api/admin/auth/profile
// @desc    Get admin profile
// @access  Private/Admin
exports.getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await AdminAuthService.getAdminProfile(req.user.id);

  successResponse(res, 200, "Profile retrieved successfully", admin);
});

// @route   PUT /api/admin/auth/profile
// @desc    Update admin profile
// @access  Private/Admin
exports.updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, phone, department, organization } = req.body;

  const admin = await AdminAuthService.updateAdminProfile(req.user.id, {
    name,
    phone,
    department,
    organization,
  });

  successResponse(res, 200, "Profile updated successfully", admin);
});

// @route   PUT /api/admin/auth/change-password
// @desc    Change admin password
// @access  Private/Admin
exports.changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return errorResponse(res, 400, "Passwords do not match");
  }

  const result = await AdminAuthService.changeAdminPassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  successResponse(res, 200, result.message);
});

// @route   POST /api/admin/auth/forgot-password
// @desc    Reset forgot password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, organization, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return errorResponse(res, 400, "Passwords do not match");
  }

  const result = await AdminAuthService.forgotPassword(
    email,
    organization,
    newPassword
  );

  successResponse(res, 200, "Password reset successfully", result);
});
