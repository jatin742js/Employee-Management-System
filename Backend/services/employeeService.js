const Employee = require("../models/Employee");

class EmployeeService {
  // Get all employees
  static async getAllEmployees(filters = {}) {
    const query = { isActive: true, ...filters };
    const employees = await Employee.find(query)
      .select("-password")
      .populate("manager", "name email");
    return employees;
  }

  // Get single employee
  static async getEmployeeById(employeeId) {
    const employee = await Employee.findById(employeeId)
      .select("-password")
      .populate("manager", "name email");

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  // Create new employee
  static async createEmployee(employeeData) {
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
      address,
    } = employeeData;

    // Check email uniqueness
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      throw new Error("Email already in use");
    }

    // Check employee ID uniqueness
    const existingEmpId = await Employee.findOne({ employeeId });
    if (existingEmpId) {
      throw new Error("Employee ID already exists");
    }

    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      employeeId,
      department,
      position,
      salary,
      dateOfJoining: dateOfJoining || new Date(),
      address,
    });

    return {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
    };
  }

  // Update employee
  static async updateEmployee(employeeId, updateData) {
    const {
      name,
      phone,
      department,
      position,
      salary,
      address,
      manager,
    } = updateData;

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { name, phone, department, position, salary, address, manager },
      { new: true, runValidators: true }
    ).populate("manager", "name email");

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  // Deactivate employee
  static async deactivateEmployee(employeeId) {
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { isActive: false },
      { new: true }
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  // Activate employee
  static async activateEmployee(employeeId) {
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { isActive: true },
      { new: true }
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  // Get employees by department
  static async getEmployeesByDepartment(department) {
    const employees = await Employee.find({
      department,
      isActive: true,
    }).select("-password");

    return employees;
  }

  // Get total employees count
  static async getTotalEmployeesCount() {
    return await Employee.countDocuments({ isActive: true });
  }
}

module.exports = EmployeeService;
