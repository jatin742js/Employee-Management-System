const Payroll = require("../models/Payroll");

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
  static async createPayroll(payrollData) {
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
