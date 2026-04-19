const express = require("express");
const { body } = require("express-validator");
const adminAuthController = require("../controllers/adminAuthController");
const { verifyToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
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

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("organization").notEmpty().withMessage("Organization is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("confirmPassword").exists().withMessage("Confirm password is required"),
];

// Routes
router.post("/register", registerValidation, adminAuthController.registerAdmin);
router.post("/login", loginValidation, adminAuthController.loginAdmin);
router.post("/forgot-password", forgotPasswordValidation, adminAuthController.forgotPassword);
router.get("/profile", verifyToken, adminOnly, adminAuthController.getAdminProfile);
router.put("/profile", verifyToken, adminOnly, adminAuthController.updateAdminProfile);
router.put("/change-password", verifyToken, adminOnly, changePasswordValidation, adminAuthController.changeAdminPassword);

module.exports = router;
