const express = require("express");

const router = express.Router();

const {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  getAdminDashboardController,
} = require("../controllers/authController");

const { isAdmin, verifyToken } = require("../middlewares/authMiddleware");

//REGISTER
router.post("/register", registerController);

//LOGIN
router.post("/login", loginController);

//LOGIN
router.post("/logout/:uid", logoutController);

//FORGOT PASSWORD
router.post("/forgotPassword", forgotPasswordController);

//FORGOT PASSWORD
router.post("/resetPassword", resetPasswordController);

//protected Admin route auth
router.get("/admin-auth", verifyToken, isAdmin, getAdminDashboardController);

module.exports = router;
