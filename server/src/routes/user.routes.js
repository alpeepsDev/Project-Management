import express from "express";
import { userController } from "../controllers/user.controller.js";
import {
  registerSchema,
  loginSchema,
  updateRoleSchema,
  validateRequest,
} from "../validations/user.validation.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(registerSchema),
  userController.register,
);
router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/refresh", userController.refreshToken);

// Protected routes
router.get("/profile", auth, userController.getProfile);
router.get("/", auth, userController.getAllUsers);

// Admin only routes
router.put(
  "/:userId/role",
  auth,
  requireAdmin,
  validateRequest(updateRoleSchema),
  userController.updateRole,
);

export default router;
