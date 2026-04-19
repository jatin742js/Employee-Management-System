const Attendance = require("../models/Attendance");
const { getTodayRange, calculateWorkingHours } = require("../utils/helpers");

class AttendanceService {
  // Get attendance with filters
  static async getAttendance(filters = {}) {
    const attendance = await Attendance.find(filters)
      .populate("employee", "name employeeId email department")
      .sort({ date: -1 });

    return attendance;
  }

  // Record attendance
  static async recordAttendance(attendanceData) {
    const { employee, date, status, checkInTime, checkOutTime, remarks } =
      attendanceData;

    const attendance = await Attendance.create({
      employee,
      date: new Date(date),
      status,
      checkInTime,
      checkOutTime,
      remarks,
    });

    return attendance;
  }

  // Check in employee
  static async checkIn(employeeId) {
    const todayRange = getTodayRange();

    // Check if already checked in
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: todayRange,
    });

    if (attendance && attendance.checkInTime) {
      throw new Error("Already checked in today");
    }

    const now = new Date();
    const checkInTime = now.toLocaleTimeString();

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employeeId,
        date: new Date(),
        status: "present",
        checkInTime,
      });
    } else {
      attendance.checkInTime = checkInTime;
      await attendance.save();
    }

    return attendance;
  }

  // Check out employee
  static async checkOut(employeeId) {
    const todayRange = getTodayRange();

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: todayRange,
    });

    if (!attendance) {
      throw new Error("No check-in record found for today");
    }

    if (attendance.checkOutTime) {
      throw new Error("Already checked out today");
    }

    const now = new Date();
    const checkOutTime = now.toLocaleTimeString();
    attendance.checkOutTime = checkOutTime;

    // Calculate working hours
    const workingHours = calculateWorkingHours(
      attendance.checkInTime,
      checkOutTime
    );
    attendance.workingHours = workingHours;

    await attendance.save();
    return attendance;
  }

  // Get employee attendance
  static async getEmployeeAttendance(employeeId, filters = {}) {
    const query = { employee: employeeId, ...filters };

    const attendance = await Attendance.find(query).sort({ date: -1 });

    return attendance;
  }

  // Get attendance for date range
  static async getAttendanceByDateRange(employeeId, fromDate, toDate) {
    const attendance = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    }).sort({ date: -1 });

    return attendance;
  }

  // Get today attendance count
  static async getTodayAttendanceCount() {
    const todayRange = getTodayRange();

    return await Attendance.countDocuments({
      date: todayRange,
      status: "present",
    });
  }

  // Update attendance
  static async updateAttendance(attendanceId, updateData) {
    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    return attendance;
  }
}

module.exports = AttendanceService;
