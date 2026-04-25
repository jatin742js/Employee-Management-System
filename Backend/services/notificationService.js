const Notification = require("../models/Notification");

class NotificationService {
  // Create notification
  static async createNotification(notificationData) {
    const notification = await Notification.create(notificationData);
    return await notification.populate([
      { path: "admin", select: "name email" },
      { path: "employee", select: "name employeeId email department" },
      { path: "payroll", select: "month baseSalary netSalary paymentStatus" }
    ]);
  }

  // Get admin notifications
  static async getAdminNotifications(adminId, filters = {}) {
    const query = { admin: adminId, ...filters };
    const notifications = await Notification.find(query)
      .populate("employee", "name employeeId email department")
      .populate("payroll", "month baseSalary netSalary paymentStatus")
      .sort({ createdAt: -1 });

    return notifications;
  }

  // Get unread notifications count
  static async getUnreadCount(adminId) {
    const count = await Notification.countDocuments({
      admin: adminId,
      isRead: false,
    });
    return count;
  }

  // Get employee notifications
  static async getEmployeeNotifications(employeeId, filters = {}) {
    const query = { employee: employeeId, ...filters };
    const notifications = await Notification.find(query)
      .populate("admin", "name email")
      .populate("payroll", "month baseSalary netSalary paymentStatus")
      .sort({ createdAt: -1 });

    return notifications;
  }

  // Get unread notifications
  static async getUnreadNotifications(adminId) {
    const notifications = await Notification.find({
      admin: adminId,
      isRead: false,
    })
      .populate("employee", "name employeeId email department")
      .populate("payroll", "month baseSalary netSalary paymentStatus")
      .sort({ createdAt: -1 });

    return notifications;
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    ).populate([
      { path: "admin", select: "name email" },
      { path: "employee", select: "name employeeId email department" },
      { path: "payroll", select: "month baseSalary netSalary paymentStatus" }
    ]);

    return notification;
  }

  // Mark all as read
  static async markAllAsRead(adminId) {
    const result = await Notification.updateMany(
      { admin: adminId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );
    return result;
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    const notification = await Notification.findByIdAndDelete(notificationId);
    return notification;
  }

  // Clear old notifications (older than 30 days)
  static async clearOldNotifications(adminId, daysOld = 30) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysOld);

    const result = await Notification.deleteMany({
      admin: adminId,
      createdAt: { $lt: dateThreshold },
    });
    return result;
  }
}

module.exports = NotificationService;
