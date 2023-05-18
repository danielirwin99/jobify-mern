import express from "express";
const router = express.Router();
import { register, login, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

// Route of register
router.route("/register").post(register);
// Route of logging in
router.route("/login").post(login);
//
router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
