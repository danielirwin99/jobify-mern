import express from "express";
const router = express.Router();
import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import testUser from "../middleware/testUser.js";
// Express Rate Limiter
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 10, // Max 10 Requests
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Route of register
router.route("/register").post(apiLimiter, register);

// Route of logging in
router.route("/login").post(apiLimiter, login);

// Route of editing the user info --> Also for restricting a guest user functionality
router.route("/updateUser").patch(authenticateUser, testUser, updateUser);

// Cookie route to getting the user --> Restricted as well
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

router.route("/logout").get(logoutUser);

export default router;
