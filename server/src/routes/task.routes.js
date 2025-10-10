import express from "express";
import { auth } from "../middleware/auth.js";
import * as taskController from "../controllers/task.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Task CRUD operations
router.get("/project/:projectId", taskController.getProjectTasks);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Kanban board operations
router.put("/:id/move", taskController.moveTask);
router.put("/:id/assign", taskController.assignTask);

// Task comments
router.get("/:id/comments", taskController.getTaskComments);
router.post("/:id/comments", taskController.addTaskComment);

// Manager-specific routes
router.get(
  "/manager/awaiting-approval",
  taskController.getTasksAwaitingApproval,
);
router.get("/manager/stats", taskController.getManagerStats);
router.get("/manager/all-tasks", taskController.getManagerTasks);
router.put("/:id/approve", taskController.approveTask);

export default router;
