import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import exchangeRoutes from "./routes/exchange.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiLogger from "./middleware/apiLogger.js";
import { rateLimit } from "./middleware/rateLimit.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API logging middleware (logs all requests)
app.use(apiLogger);

// Rate limiting middleware (applies to all routes)
// Temporarily disable global rate limiting while debugging
// app.use(rateLimit);

// Conditionally mount rate limiting middleware only when enabled
if (process.env.RATE_LIMITING_ENABLED === "true") {
  app.use(rateLimit);
} else {
  // No-op in dev by default
  console.info(
    "Rate limiting is disabled. Set RATE_LIMITING_ENABLED=true to enable enforcement."
  );
}

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/exchanges", exchangeRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskForge API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
