import express from "express";
import { auth } from "../middleware/auth.js";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Project CRUD operations
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

// Project member management
router.get("/:id/members", projectController.getProjectMembers);
router.post("/:id/members", projectController.addProjectMember);
router.delete("/:id/members/:userId", projectController.removeProjectMember);

export default router;
