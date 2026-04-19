const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");
const { verifyToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

// ============ EMPLOYEE MANAGEMENT ============
router.get("/employees", verifyToken, adminOnly, adminController.getAllEmployees);
router.get("/employees/:id", verifyToken, adminOnly, adminController.getEmployeeById);
router.post(
  "/employees",
  verifyToken,
  adminOnly,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("position").notEmpty().withMessage("Position is required"),
  ],
  adminController.createEmployee
);
router.put("/employees/:id", verifyToken, adminOnly, adminController.updateEmployee);
router.put("/employees/:id/deactivate", verifyToken, adminOnly, adminController.deactivateEmployee);
router.put("/employees/:id/activate", verifyToken, adminOnly, adminController.activateEmployee);

// ============ ATTENDANCE MANAGEMENT ============
router.get("/attendance", verifyToken, adminOnly, adminController.getAttendance);
router.post(
  "/attendance",
  verifyToken,
  adminOnly,
  [
    body("employee").notEmpty().withMessage("Employee ID is required"),
    body("date").isISO8601().withMessage("Invalid date format"),
    body("status").isIn(["present", "absent", "leave", "half-day"]).withMessage("Invalid status"),
  ],
  adminController.recordAttendance
);

// ============ LEAVE MANAGEMENT ============
router.get("/leaves", verifyToken, adminOnly, adminController.getAllLeaves);
router.put("/leaves/:id/approve", verifyToken, adminOnly, adminController.approveLeave);
router.put("/leaves/:id/reject", verifyToken, adminOnly, [body("rejectionReason").notEmpty()], adminController.rejectLeave);

// ============ PAYROLL MANAGEMENT ============
router.get("/payroll", verifyToken, adminOnly, adminController.getAllPayroll);
router.post(
  "/payroll",
  verifyToken,
  adminOnly,
  [
    body("employee").notEmpty().withMessage("Employee ID is required"),
    body("month").matches(/^\d{4}-\d{2}$/).withMessage("Invalid month format"),
    body("baseSalary").isNumeric().withMessage("Base salary must be a number"),
  ],
  adminController.createPayroll
);
router.put("/payroll/:id/status", verifyToken, adminOnly, adminController.updatePayrollStatus);

// ============ DASHBOARD ============
router.get("/dashboard/stats", verifyToken, adminOnly, adminController.getDashboardStats);

module.exports = router;
