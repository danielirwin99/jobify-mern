import express from "express";
const router = express.Router();
import { register, login, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
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
//
router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
