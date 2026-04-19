const Leave = require("../models/Leave");
const { calculateDaysBetween } = require("../utils/helpers");

class LeaveService {
  // Get all leaves with filters
  static async getAllLeaves(filters = {}) {
    const leaves = await Leave.find(filters)
      .populate("employee", "name employeeId email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    return leaves;
  }

  // Get employee leaves
  static async getEmployeeLeaves(employeeId, filters = {}) {
    const query = { employee: employeeId, ...filters };

    const leaves = await Leave.find(query)
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    return leaves;
  }

  // Request leave
  static async requestLeave(leaveData) {
    const { employee, leaveType, startDate, endDate, numberOfDays, reason } =
      leaveData;

    // Verify numberOfDays matches date range
    const calculatedDays = calculateDaysBetween(startDate, endDate);
    if (numberOfDays !== calculatedDays) {
      throw new Error(
        `Number of days should be ${calculatedDays} for selected dates`
      );
    }

    const leave = await Leave.create({
      employee,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      numberOfDays,
      reason,
    });

    return leave;
  }

  // Approve leave
  static async approveLeave(leaveId, approvedBy) {
    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: "approved", approvedBy },
      { new: true }
    )
      .populate("employee", "name employeeId email")
      .populate("approvedBy", "name email");

    if (!leave) {
      throw new Error("Leave not found");
    }

    return leave;
  }

  // Reject leave
  static async rejectLeave(leaveId, rejectionReason, approvedBy) {
    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: "rejected", rejectionReason, approvedBy },
      { new: true }
    )
      .populate("employee", "name employeeId email")
      .populate("approvedBy", "name email");

    if (!leave) {
      throw new Error("Leave not found");
    }

    return leave;
  }

  // Get pending leaves count
  static async getPendingLeavesCount() {
    return await Leave.countDocuments({ status: "pending" });
  }

  // Get leave details
  static async getLeaveById(leaveId) {
    const leave = await Leave.findById(leaveId)
      .populate("employee", "name employeeId email")
      .populate("approvedBy", "name email");

    if (!leave) {
      throw new Error("Leave not found");
    }

    return leave;
  }

  // Cancel leave (only for pending)
  static async cancelLeave(leaveId, employeeId) {
    const leave = await Leave.findOne({
      _id: leaveId,
      employee: employeeId,
    });

    if (!leave) {
      throw new Error("Leave not found");
    }

    if (leave.status !== "pending") {
      throw new Error("Only pending leave requests can be cancelled");
    }

    await Leave.findByIdAndDelete(leaveId);
    return { message: "Leave request cancelled successfully" };
  }

  // Get department leave summary
  static async getDepartmentLeaveSummary(department, startDate, endDate) {
    const leaves = await Leave.aggregate([
      {
        $match: {
          status: "approved",
          startDate: { $gte: new Date(startDate) },
          endDate: { $lte: new Date(endDate) },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeData",
        },
      },
      {
        $match: {
          "employeeData.department": department,
        },
      },
      {
        $group: {
          _id: "$employee",
          totalDays: { $sum: "$numberOfDays" },
        },
      },
    ]);

    return leaves;
  }
}

module.exports = LeaveService;
