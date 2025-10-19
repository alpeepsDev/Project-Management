import app from "./app.js";
import prisma from "./config/database.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initializeWebSocket } from "./services/websocket.service.js";

const PORT = process.env.PORT;

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

async function startServer() {
  await testDatabaseConnection();

  // Create HTTP server
  const server = createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // Initialize WebSocket handlers
  initializeWebSocket(io);

  // Make io accessible throughout the app
  app.set("io", io);

  server.listen(PORT, () => {
    console.log(`🚀 TaskForge server running on port http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔌 WebSocket server ready for real-time notifications`);
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
