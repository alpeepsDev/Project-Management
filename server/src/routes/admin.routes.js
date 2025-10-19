import express from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticateToken);
router.use(requireAdmin);

// ==================== API MONITORING ====================
router.get("/stats", adminController.getApiStats);
router.get("/stats/users", adminController.getUserActivity);

// ==================== RATE LIMIT CONFIGURATION ====================
router.get("/rate-limits", adminController.getRateLimits);
router.put("/rate-limits/:role", adminController.updateRateLimit);

// Endpoint rate limits
router.get("/rate-limits/endpoints", adminController.getEndpointRateLimits);
router.post("/rate-limits/endpoints", adminController.createEndpointRateLimit);
router.put(
  "/rate-limits/endpoints/:id",
  adminController.updateEndpointRateLimit
);
router.delete(
  "/rate-limits/endpoints/:id",
  adminController.deleteEndpointRateLimit
);

// List available endpoints for configuration UI
router.get("/endpoints", adminController.listAvailableEndpoints);

// User-specific rate limits
router.get("/rate-limits/users", adminController.getUserRateLimits);
router.post("/rate-limits/users/:userId", adminController.setUserRateLimit);
router.delete(
  "/rate-limits/users/:userId",
  adminController.removeUserRateLimit
);

// ==================== SYSTEM HEALTH ====================
router.get("/health", adminController.getSystemHealth);
router.get("/health/history", adminController.getHealthHistory);

// ==================== USER MANAGEMENT ====================
router.get("/users", adminController.getUsers);
router.get("/users/:userId", adminController.getUserDetails);
router.patch("/users/:userId/status", adminController.updateUserStatus);
router.patch("/users/:userId/role", adminController.updateUserRole);

// ==================== AUDIT LOGS ====================
router.get("/audit-logs", adminController.getAuditLogs);

// ==================== MAINTENANCE ====================
router.delete("/logs/cleanup", adminController.cleanOldLogs);

export default router;
