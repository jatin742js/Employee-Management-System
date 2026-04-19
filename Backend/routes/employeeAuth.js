const express = require("express");
const { body } = require("express-validator");
const employeeAuthController = require("../controllers/employeeAuthController");
const { verifyToken, employeeOnly } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("employeeId").notEmpty().withMessage("Employee ID is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("position").notEmpty().withMessage("Position is required"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password is required"),
];

const changePasswordValidation = [
  body("currentPassword").exists().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("confirmPassword").exists().withMessage("Confirm password is required"),
];

// Routes
router.post("/register", registerValidation, employeeAuthController.registerEmployee);
router.post("/login", loginValidation, employeeAuthController.loginEmployee);
router.get("/profile", verifyToken, employeeOnly, employeeAuthController.getEmployeeProfile);
router.put("/profile", verifyToken, employeeOnly, employeeAuthController.updateEmployeeProfile);
router.put("/change-password", verifyToken, employeeOnly, changePasswordValidation, employeeAuthController.changeEmployeePassword);

module.exports = router;
