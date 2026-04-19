const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "half-day"],
      required: true,
    },
    checkInTime: {
      type: String,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: null,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index to prevent duplicate attendance records
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
