const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    payroll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
    },
    type: {
      type: String,
      enum: ["payroll_sent", "payroll_updated", "payment_processed", "payment_completed"],
      default: "payroll_sent",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    data: {
      month: String,
      year: String,
      baseSalary: Number,
      netSalary: Number,
      paymentStatus: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ admin: 1, createdAt: -1 });
notificationSchema.index({ admin: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
