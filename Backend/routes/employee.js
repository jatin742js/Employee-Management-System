const express = require("express");
const { body } = require("express-validator");
const employeeController = require("../controllers/employeeController");
const { verifyToken, employeeOnly } = require("../middleware/auth");

const router = express.Router();

// ============ ATTENDANCE ============
router.get("/attendance", verifyToken, employeeOnly, employeeController.getMyAttendance);
router.post("/attendance/check-in", verifyToken, employeeOnly, employeeController.checkIn);
router.post("/attendance/check-out", verifyToken, employeeOnly, employeeController.checkOut);

// ============ LEAVES ============
router.get("/leaves", verifyToken, employeeOnly, employeeController.getMyLeaves);
router.post(
  "/leaves",
  verifyToken,
  employeeOnly,
  [
    body("leaveType").isIn(["sick", "casual", "earned", "maternity", "paternity", "unpaid"]),
    body("startDate").isISO8601().withMessage("Invalid start date"),
    body("endDate").isISO8601().withMessage("Invalid end date"),
    body("numberOfDays").isNumeric().withMessage("Number of days must be a number"),
    body("reason").notEmpty().withMessage("Reason is required"),
  ],
  employeeController.requestLeave
);
router.delete("/leaves/:id", verifyToken, employeeOnly, employeeController.cancelLeave);

// ============ PAYROLL ============
router.get("/payroll", verifyToken, employeeOnly, employeeController.getMyPayroll);
router.get("/payroll/:id", verifyToken, employeeOnly, employeeController.getPayrollDetails);

// ============ DASHBOARD ============
router.get("/dashboard/stats", verifyToken, employeeOnly, employeeController.getDashboardStats);

module.exports = router;
