import api from "./index.js";

// Mock users for testing different roles
const MOCK_USERS = {
  "user1@example.com": {
    id: "u1",
    username: "testuser",
    email: "user1@example.com",
    name: "Test User",
    role: "USER",
    avatar: null,
    createdAt: "2025-09-01",
    lastLogin: "2025-09-23",
  },
  "manager2@example.com": {
    id: "m1",
    username: "testmanager",
    email: "manager2@example.com",
    name: "Test Manager",
    role: "MANAGER",
    avatar: null,
    createdAt: "2025-09-01",
    lastLogin: "2025-09-23",
  },
  "moderator1@example.com": {
    id: "mod1",
    username: "testmoderator",
    email: "moderator1@example.com",
    name: "Test Moderator",
    role: "MODERATOR",
    avatar: null,
    createdAt: "2025-09-01",
    lastLogin: "2025-09-23",
  },
  "admin1@example.com": {
    id: "a1",
    username: "testadmin",
    email: "admin1@example.com",
    name: "Test Admin",
    role: "ADMIN",
    avatar: null,
    createdAt: "2025-09-01",
    lastLogin: "2025-09-23",
  },
};

// Enable real authentication (no more mock mode)
const USE_MOCK_AUTH = false;

export const authService = {
  // Storage helper methods
  getStorage(persistent = true) {
    return persistent ? localStorage : sessionStorage;
  },

  setTokens(accessToken, refreshToken, persistent = true) {
    const storage = this.getStorage(persistent);
    const otherStorage = this.getStorage(!persistent);

    // Clear tokens from the other storage type
    otherStorage.removeItem("accessToken");
    otherStorage.removeItem("refreshToken");
    otherStorage.removeItem("user");
    otherStorage.removeItem("persistent");

    // Set tokens in the chosen storage
    storage.setItem("accessToken", accessToken);
    storage.setItem("refreshToken", refreshToken);
    storage.setItem("persistent", persistent.toString());
  },

  setCurrentUser(user, persistent = true) {
    const storage = this.getStorage(persistent);
    storage.setItem("user", JSON.stringify(user));
  },

  isPersistent() {
    const persistentFlag =
      localStorage.getItem("persistent") ||
      sessionStorage.getItem("persistent");
    return persistentFlag === "true";
  },

  async login(credentials) {
    try {
      // Extract rememberMe from credentials
      const { rememberMe = false, ...loginData } = credentials;

      if (USE_MOCK_AUTH) {
        // Mock authentication
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

        const { email, password } = loginData;

        // Mock authentication logic - in production, this would be server-side
        const user = MOCK_USERS[email];

        if (!user || password !== "password123") {
          throw { message: "Invalid email or password" };
        }

        // Generate mock tokens
        const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
        const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;

        // Store tokens based on rememberMe preference
        this.setTokens(accessToken, refreshToken, rememberMe);
        this.setCurrentUser(user, rememberMe);

        return {
          success: true,
          message: "Login successful",
          data: {
            user,
            accessToken,
            refreshToken,
          },
        };
      } else {
        // Real API authentication
        const response = await api.post("/users/login", loginData);

        // Check if response has the expected structure
        if (!response.data || !response.data.data) {
          throw new Error("Invalid server response structure");
        }

        const { accessToken, refreshToken, user } = response.data.data;

        if (!accessToken || !refreshToken || !user) {
          throw new Error("Invalid login response: missing token or user data");
        }

        // Store tokens based on rememberMe preference
        this.setTokens(accessToken, refreshToken, rememberMe);
        this.setCurrentUser(user, rememberMe);

        return response.data;
      }
    } catch (error) {
      // Improved error handling
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        throw errorData || { message: "Login failed" };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          message:
            "Network error. Please check your connection and ensure the server is running.",
        };
      } else {
        // Something else happened
        throw { message: error.message || "Login failed" };
      }
    }
  },

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/users/refresh", { refreshToken });

      if (!response.data || !response.data.data) {
        throw new Error("Invalid refresh response structure");
      }

      const { accessToken, user } = response.data.data;

      if (!accessToken || !user) {
        throw new Error(
          "Invalid refresh response: missing access token or user data"
        );
      }

      // Update stored access token and user (maintain same storage preference)
      const persistent = this.isPersistent();
      const storage = this.getStorage(persistent);

      storage.setItem("accessToken", accessToken);
      storage.setItem("user", JSON.stringify(user));

      return { accessToken, user };
    } catch (error) {
      // If refresh fails, clear all tokens
      this.logout();
      throw error;
    }
  },

  async register(userData) {
    try {
      if (USE_MOCK_AUTH) {
        // Mock registration
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

        const { email, username, password, name } = userData;

        // Check if user already exists
        if (MOCK_USERS[email]) {
          throw { message: "User with this email already exists" };
        }

        // Create new user (in real app, this would be stored in database)
        const newUser = {
          id: `u${Date.now()}`,
          username,
          email,
          name: name || username,
          role: "USER", // Default role for new users
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // In a real app, you'd store this in database
        // For demo purposes, we'll just add to our mock users temporarily
        MOCK_USERS[email] = newUser;

        return {
          success: true,
          message: "Registration successful",
          data: {
            user: newUser,
          },
        };
      } else {
        // Real API registration
        const response = await api.post("/users/register", userData);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        throw error.response.data || { message: "Registration failed" };
      } else if (error.request) {
        throw { message: "Network error. Please check your connection." };
      } else {
        throw { message: error.message || "Registration failed" };
      }
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data || { message: "Failed to fetch profile" };
      } else {
        throw { message: "Failed to fetch profile" };
      }
    }
  },

  logout() {
    // Clear tokens from both storage types
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("persistent");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("persistent");
  },

  getCurrentUser() {
    const userStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getAccessToken() {
    return (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    );
  },

  getRefreshToken() {
    return (
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken")
    );
  },

  getToken() {
    // For backward compatibility
    return this.getAccessToken();
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },
};
