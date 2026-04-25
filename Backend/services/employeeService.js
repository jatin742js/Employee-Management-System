const Employee = require("../models/Employee");
const { emitToAllAdmins } = require("../utils/socketEmitter");

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
      .select("+password +plainPassword") // Explicitly include password fields for admin viewing
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
      allowances,
      deductions,
      dateOfJoining,
      gender,
      bio,
      photo,
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
      allowances: allowances || 0,
      deductions: deductions || 0,
      dateOfJoining: dateOfJoining || new Date(),
      gender: gender || '',
      bio: bio || '',
      photo: photo || null,
      address,
      plainPassword: password, // Store original password for admin viewing
    });

    // Emit real-time notification via Socket.io
    emitToAllAdmins("employee:created", {
      employeeId: employee._id,
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
      department: employee.department,
      position: employee.position,
      timestamp: new Date(),
      message: `New employee ${name} has been created`,
    });

    return {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
      password: password, // Return plain password for admin to see
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
      allowances,
      deductions,
      gender,
      bio,
      photo,
      address,
      manager,
      dateOfJoining,
      password, // New password if provided
    } = updateData;

    // If password is being updated, use save() to trigger pre-save middleware
    if (password && password.trim()) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }
      
      // Update all fields
      employee.name = name || employee.name;
      employee.phone = phone || employee.phone;
      employee.department = department || employee.department;
      employee.position = position || employee.position;
      employee.salary = salary || employee.salary;
      employee.allowances = allowances || employee.allowances;
      employee.deductions = deductions || employee.deductions;
      employee.gender = gender || employee.gender;
      employee.bio = bio || employee.bio;
      employee.photo = photo || employee.photo;
      employee.address = address || employee.address;
      employee.manager = manager || employee.manager;
      employee.dateOfJoining = dateOfJoining || employee.dateOfJoining;
      employee.password = password; // This will be hashed by pre-save
      employee.plainPassword = password; // Store plain password for admin viewing
      
      await employee.save();
      await employee.populate("manager", "name email");

      // Emit real-time update via Socket.io
      emitToAllAdmins("employee:updated", {
        employeeId: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        timestamp: new Date(),
        message: `Employee ${employee.name} has been updated`,
      });

      return employee;
    } else {
      // No password change, use findByIdAndUpdate
      const employee = await Employee.findByIdAndUpdate(
        employeeId,
        { 
          name, 
          phone, 
          department, 
          position, 
          salary, 
          allowances, 
          deductions, 
          gender, 
          bio, 
          photo, 
          address, 
          manager,
          dateOfJoining,
        },
        { new: true, runValidators: true }
      ).populate("manager", "name email");

      if (!employee) {
        throw new Error("Employee not found");
      }

      // Emit real-time update via Socket.io
      emitToAllAdmins("employee:updated", {
        employeeId: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        timestamp: new Date(),
        message: `Employee ${employee.name} has been updated`,
      });

      return employee;
    }
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

  // Delete employee permanently
  static async deleteEmployee(employeeId) {
    const employee = await Employee.findByIdAndDelete(employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return { success: true, message: "Employee deleted successfully" };
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

  // Get count of unique active departments
  static async getDepartmentsCount() {
    const departments = await Employee.distinct("department", {
      isActive: true,
      department: { $exists: true, $nin: [null, ""] },
    });

    return departments.length;
  }
}

module.exports = EmployeeService;
