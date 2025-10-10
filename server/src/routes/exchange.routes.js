import express from "express";
import { auth } from "../middleware/auth.js";
import * as exchangeController from "../controllers/exchange.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Task exchange operations
router.get("/", exchangeController.getExchanges);
router.get("/project", exchangeController.getProjectExchanges); // Manager-only endpoint
router.get("/sent", exchangeController.getSentExchanges);
router.get("/received", exchangeController.getReceivedExchanges);
router.post("/", exchangeController.createExchange);
router.put("/:id/respond", exchangeController.respondToExchange);
router.put("/:id/accept", exchangeController.acceptExchange);
router.put("/:id/reject", exchangeController.rejectExchange);
router.put("/:id/cancel", exchangeController.cancelExchange);
router.delete("/:id", exchangeController.cancelExchange);

export default router;
