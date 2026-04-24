const Payroll = require("../models/Payroll");
const NotificationService = require("./notificationService");
const Admin = require("../models/Admin");
const { emitToAdmin, emitToEmployee } = require("../utils/socketEmitter");

class PayrollService {
  // Get all payroll records with filters
  static async getAllPayroll(filters = {}) {
    const payroll = await Payroll.find(filters)
      .populate("employee", "name employeeId email department")
      .sort({ month: -1 });

    return payroll;
  }

  // Get employee payroll
  static async getEmployeePayroll(employeeId, filters = {}) {
    const query = { employee: employeeId, ...filters };

    const payroll = await Payroll.find(query).sort({ month: -1 });

    return payroll;
  }

  // Create payroll
  static async createPayroll(payrollData, adminId = null) {
    const {
      employee,
      month,
      baseSalary,
      allowances,
      deductions,
      bonus,
      paymentMethod,
    } = payrollData;

    // Check if payroll already exists for this month
    const existingPayroll = await Payroll.findOne({ employee, month });
    if (existingPayroll) {
      throw new Error("Payroll already exists for this employee in this month");
    }

    // Calculate net salary
    const netSalary = baseSalary + (allowances || 0) + (bonus || 0) - (deductions || 0);

    const payroll = await Payroll.create({
      employee,
      month,
      baseSalary,
      allowances,
      deductions,
      bonus,
      netSalary,
      paymentMethod,
    });

    // Create notification for admin
    try {
      const admin = adminId ? 
        await Admin.findById(adminId) : 
        await Admin.findOne();
      
      if (admin) {
        const [monthPart, yearPart] = month.split('-');
        const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(monthPart)] || 'Unknown';

        await NotificationService.createNotification({
          admin: admin._id,
          employee: employee,
          payroll: payroll._id,
          type: "payroll_sent",
          title: "Payroll Generated",
          message: `Payroll for ${monthName} ${yearPart} has been generated`,
          description: `Net Salary: ₹${netSalary.toLocaleString('en-IN')}`,
          data: {
            month,
            year: yearPart,
            baseSalary,
            netSalary,
            paymentStatus: payroll.paymentStatus,
          },
        });

        // Emit real-time notification via Socket.io
        emitToAdmin(admin._id.toString(), "payroll:created", {
          payrollId: payroll._id,
          employeeId: employee,
          month,
          netSalary,
          baseSalary,
          timestamp: new Date(),
          message: `Payroll for ${monthName} ${yearPart} has been generated`,
        });

        // Notify employee about payroll
        emitToEmployee(employee.toString(), "payroll:notified", {
          payrollId: payroll._id,
          month,
          netSalary,
          baseSalary,
          message: `Your payroll for ${monthName} ${yearPart} is ready`,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      // Don't throw error - notification failure shouldn't block payroll creation
    }

    return payroll;
  }

  // Update payroll
  static async updatePayroll(payrollId, updateData) {
    const {
      baseSalary,
      allowances,
      deductions,
      bonus,
      remarks,
    } = updateData;

    // Recalculate net salary if salary components change
    if (baseSalary || allowances !== undefined || deductions !== undefined || bonus !== undefined) {
      const payroll = await Payroll.findById(payrollId);

      const newBaseSalary = baseSalary || payroll.baseSalary;
      const newAllowances = allowances !== undefined ? allowances : payroll.allowances;
      const newDeductions = deductions !== undefined ? deductions : payroll.deductions;
      const newBonus = bonus !== undefined ? bonus : payroll.bonus;

      updateData.netSalary = newBaseSalary + newAllowances + newBonus - newDeductions;
    }

    const payroll = await Payroll.findByIdAndUpdate(payrollId, updateData, {
      new: true,
      runValidators: true,
    }).populate("employee", "name employeeId email");

    if (!payroll) {
      throw new Error("Payroll not found");
    }

    // Emit real-time update via Socket.io
    const admin = await Admin.findOne();
    if (admin) {
      emitToAdmin(admin._id.toString(), "payroll:updated", {
        payrollId: payroll._id,
        employeeId: payroll.employee._id,
        netSalary: payroll.netSalary,
        baseSalary: payroll.baseSalary,
        timestamp: new Date(),
      });

      emitToEmployee(payroll.employee._id.toString(), "payroll:updated", {
        payrollId: payroll._id,
        netSalary: payroll.netSalary,
        baseSalary: payroll.baseSalary,
        message: "Your payroll information has been updated",
        timestamp: new Date(),
      });
    }

    return payroll;
  }

  // Update payroll status
  static async updatePayrollStatus(payrollId, paymentStatus, paymentDate) {
    const payroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { paymentStatus, paymentDate: paymentDate || new Date() },
      { new: true }
    ).populate("employee", "name employeeId email");

    if (!payroll) {
      throw new Error("Payroll not found");
    }

    // Emit real-time status update via Socket.io
    const admin = await Admin.findOne();
    if (admin) {
      emitToAdmin(admin._id.toString(), "payroll:statusUpdated", {
        payrollId: payroll._id,
        employeeId: payroll.employee._id,
        paymentStatus: payroll.paymentStatus,
        paymentDate: payroll.paymentDate,
        timestamp: new Date(),
      });

      emitToEmployee(payroll.employee._id.toString(), "payroll:statusUpdated", {
        payrollId: payroll._id,
        paymentStatus: payroll.paymentStatus,
        paymentDate: payroll.paymentDate,
        message: `Your payment status has been updated to ${paymentStatus}`,
        timestamp: new Date(),
      });
    }

    return payroll;
  }

  // Get payroll by ID
  static async getPayrollById(payrollId, employeeId = null) {
    let query = { _id: payrollId };

    if (employeeId) {
      query.employee = employeeId;
    }

    const payroll = await Payroll.findOne(query).populate(
      "employee",
      "name employeeId email department"
    );

    if (!payroll) {
      throw new Error("Payroll not found");
    }

    return payroll;
  }

  // Get payroll summary for month
  static async getPayrollSummary(month) {
    const payroll = await Payroll.aggregate([
      { $match: { month } },
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalBaseSalary: { $sum: "$baseSalary" },
          totalAllowances: { $sum: "$allowances" },
          totalDeductions: { $sum: "$deductions" },
          totalBonus: { $sum: "$bonus" },
          totalNetSalary: { $sum: "$netSalary" },
        },
      },
    ]);

    return payroll[0] || {};
  }

  // Get payment status summary
  static async getPaymentStatusSummary(month) {
    const summary = await Payroll.aggregate([
      { $match: { month } },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$netSalary" },
        },
      },
    ]);

    return summary;
  }

  // Get pending payments
  static async getPendingPayments(month = null) {
    const query = { paymentStatus: "pending" };

    if (month) {
      query.month = month;
    }

    const payroll = await Payroll.find(query)
      .populate("employee", "name employeeId email department")
      .sort({ month: -1 });

    return payroll;
  }
}

module.exports = PayrollService;
