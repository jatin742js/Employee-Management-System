const Admin = require("../models/Admin");
const { generateToken } = require("../utils/tokenUtils");

class AdminAuthService {
  // Register new admin
  static async registerAdmin(adminData) {
    const { name, email, password, phone, department, organization } = adminData;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error("Admin already exists with this email");
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      phone,
      department,
      organization,
    });

    // Generate token
    const token = generateToken(admin._id, admin.role);

    return {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        organization: admin.organization,
      },
    };
  }

  // Login admin
  static async loginAdmin(email, password) {
    // Find admin and select password field
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken(admin._id, admin.role);

    return {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        organization: admin.organization,
      },
    };
  }

  // Get admin profile
  static async getAdminProfile(adminId) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  }

  // Update admin profile
  static async updateAdminProfile(adminId, updateData) {
    const { name, phone, department, organization } = updateData;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { name, phone, department, organization },
      { new: true, runValidators: true }
    );

    if (!admin) {
      throw new Error("Admin not found");
    }

    return admin;
  }

  // Change password
  static async changeAdminPassword(adminId, currentPassword, newPassword) {
    const admin = await Admin.findById(adminId).select("+password");
    if (!admin) {
      throw new Error("Admin not found");
    }

    // Verify current password
    const isPasswordMatch = await admin.matchPassword(currentPassword);
    if (!isPasswordMatch) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return { message: "Password changed successfully" };
  }

  // Forgot password - verify admin and reset password
  static async forgotPassword(email, organization, newPassword) {
    // Find admin by email (case-insensitive) and organization
    const admin = await Admin.findOne({
      email: { $regex: `^${email}$`, $options: 'i' },
      department: { $regex: `^${organization}$`, $options: 'i' },
    });

    if (!admin) {
      // Log for debugging
      console.log('Admin search failed for:', { email, organization });
      
      // Try to find by email only to give better error message
      const adminByEmail = await Admin.findOne({
        email: { $regex: `^${email}$`, $options: 'i' },
      });
      
      if (adminByEmail) {
        throw new Error(`Your account is registered under organization: "${adminByEmail.department}". Please enter that organization name.`);
      }
      
      throw new Error("Admin not found. Please verify your email and organization name.");
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return {
      message: "Password reset successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    };
  }
}

module.exports = AdminAuthService;
