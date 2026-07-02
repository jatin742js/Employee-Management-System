const Admin = require("../models/Admin");
const { generateToken } = require("../utils/tokenUtils");

class AdminAuthService {
  // Register new admin
  static async registerAdmin(adminData) {
    const { name, email, password, phone, organization } = adminData;

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
        organization: admin.organization,
        address: admin.address,
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
        organization: admin.organization,
        address: admin.address,
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
    const { name, email, organization, address } = updateData;

    const updateFields = {
      email,
      organization,
    };

    if (address) {
      updateFields.address = address;
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      updateFields,
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

}

module.exports = AdminAuthService;
