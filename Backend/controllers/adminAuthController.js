const AdminAuthService = require("../services/adminAuthService");
const { successResponse, errorResponse } = require("../utils/responseUtils");
const { asyncHandler } = require("../utils/errorHandler");

// @route   POST /api/admin/auth/register
// @desc    Register new admin
// @access  Public
exports.registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone, organization } = req.body;

  const result = await AdminAuthService.registerAdmin({
    name,
    email,
    password,
    phone,
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
  const { name, email, organization, address } = req.body;

  const admin = await AdminAuthService.updateAdminProfile(req.user.id, {
    name,
    email,
    organization,
    address,
  });

  // Emit real-time update event via Socket.io
  try {
    const { getIO } = require("../utils/socketEmitter");
    const io = getIO();
    if (io) {
      // Emit to admin
      io.to(`admin:${req.user.id}`).emit('admin:addressUpdated', {
        address: admin.address,
        organization: admin.organization,
        email: admin.email,
        phone: admin.phone,
      });
      
      // Broadcast to all employees for real-time company info update
      io.emit('company:infoUpdated', {
        address: admin.address,
        organization: admin.organization,
        email: admin.email,
        phone: admin.phone,
      });
    }
  } catch (err) {
    console.log('Socket emission failed:', err.message);
  }

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

// @route   GET /api/admin/auth/company-info
// @desc    Get company information (public - for employees)
// @access  Public
exports.getCompanyInfo = asyncHandler(async (req, res) => {
  const Admin = require("../models/Admin");
  const isPayslipContext = req.query.context === 'payslip';
  
  // Get the first admin (company) - there should typically be only one admin per company
  const admin = await Admin.findOne().select('organization email phone address');
  
  if (!admin) {
    return errorResponse(res, 404, "Company information not found");
  }
  
  const companyInfo = {
    organization: admin.organization || 'EMPLOYEE MANAGEMENT SYSTEM',
    email: admin.email || 'hr@company.com',
    address: admin.address || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  };

  if (!isPayslipContext) {
    companyInfo.phone = admin.phone || 'N/A';
  }
  
  successResponse(res, 200, "Company information retrieved", companyInfo);
});
