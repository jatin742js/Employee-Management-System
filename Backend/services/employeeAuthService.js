const Employee = require("../models/Employee");
const { generateToken } = require("../utils/tokenUtils");

class EmployeeAuthService {
  // Register new employee
  static async registerEmployee(employeeData) {
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
    } = employeeData;

    // Check if employee exists by email
    let employee = await Employee.findOne({ email });
    if (employee) {
      throw new Error("Employee already exists with this email");
    }

    // Check if employee ID exists
    employee = await Employee.findOne({ employeeId });
    if (employee) {
      throw new Error("Employee ID already exists");
    }

    // Create new employee
    employee = await Employee.create({
      name,
      email,
      password,
      phone,
      employeeId,
      department,
      position,
      salary,
      dateOfJoining: dateOfJoining || new Date(),
    });

    // Generate token
    const token = generateToken(employee._id, employee.role);

    return {
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        role: employee.role,
      },
    };
  }

  // Login employee
  static async loginEmployee(email, password) {
    // Find employee and select password field
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordMatch = await employee.matchPassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken(employee._id, employee.role);

    return {
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        role: employee.role,
      },
    };
  }

  // Get employee profile
  static async getEmployeeProfile(employeeId) {
    const employee = await Employee.findById(employeeId).select("-password");
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  // Update employee profile
  static async updateEmployeeProfile(employeeId, updateData) {
    const { name, phone, address } = updateData;

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  // Change password
  static async changeEmployeePassword(
    employeeId,
    currentPassword,
    newPassword
  ) {
    const employee = await Employee.findById(employeeId).select("+password");
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Verify current password
    const isPasswordMatch = await employee.matchPassword(currentPassword);
    if (!isPasswordMatch) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    employee.password = newPassword;
    await employee.save();

    return { message: "Password changed successfully" };
  }
}

module.exports = EmployeeAuthService;
