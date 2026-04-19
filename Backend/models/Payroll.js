const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: String,
      required: true, // Format: YYYY-MM
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processed", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bank-transfer", "check", "cash"],
      default: "bank-transfer",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index to prevent duplicate payroll records
payrollSchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
