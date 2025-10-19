import { io } from "socket.io-client";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentToken = null;
  }

  connect(token) {
    // If already connected with the same token, don't reconnect
    if (this.socket?.connected && this.currentToken === token) {
      console.log("🔌 Already connected to WebSocket with same token");
      return this.socket;
    }

    // Disconnect existing connection if any
    if (this.socket) {
      console.log("🔌 Disconnecting existing WebSocket connection");
      this.socket.disconnect();
    }

    console.log(
      "🔌 Connecting to WebSocket with token:",
      token ? "Token provided" : "No token"
    );

    this.currentToken = token;

    try {
      this.socket = io(
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
        {
          auth: {
            token: token,
          },
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        }
      );

      this.socket.on("connect", () => {
        console.log("✅ Connected to WebSocket server");
        this.isConnected = true;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Disconnected from WebSocket server:", reason);
        this.isConnected = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ WebSocket connection error:", error.message);
        this.isConnected = false;

        // If authentication error, handle token refresh
        if (
          error.message.includes("Authentication error") ||
          error.message.includes("Invalid token") ||
          error.message.includes("jwt expired")
        ) {
          console.log("🔄 WebSocket auth failed - tokens may be expired");

          // Clear expired tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");

          // Redirect to login if not already there
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      });

      this.socket.on("notification", (notification) => {
        console.log("📢 Real-time notification received:", notification);
        // Emit custom event for notification components to listen to
        window.dispatchEvent(
          new CustomEvent("realtimeNotification", {
            detail: notification,
          })
        );
      });

      return this.socket;
    } catch (error) {
      console.error("Failed to connect to WebSocket server:", error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentToken = null;
      console.log("🔌 WebSocket disconnected");
    }
  }

  // Join project room (for managers)
  joinProject(projectId) {
    if (this.socket?.connected) {
      this.socket.emit("join-project", projectId);
      console.log(`🏠 Joined project room: ${projectId}`);
    }
  }

  // Leave project room
  leaveProject(projectId) {
    if (this.socket?.connected) {
      this.socket.emit("leave-project", projectId);
      console.log(`🚪 Left project room: ${projectId}`);
    }
  }

  // Subscribe to real-time notifications
  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  // Unsubscribe from notifications
  offNotification(callback) {
    if (this.socket) {
      this.socket.off("notification", callback);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
