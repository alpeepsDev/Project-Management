import api from "./index";

const adminApi = {
  // ==================== API MONITORING ====================

  /**
   * Get API statistics
   * @param {string} timeRange - '1h', '24h', '7d', or '30d'
   */
  getApiStats: async (timeRange = "24h") => {
    const response = await api.get(`/admin/stats?timeRange=${timeRange}`);
    return response.data;
  },

  /**
   * Get user activity
   * @param {number} limit - Number of users to return
   */
  getUserActivity: async (limit = 10) => {
    const response = await api.get(`/admin/stats/users?limit=${limit}`);
    return response.data;
  },

  // ==================== RATE LIMIT CONFIGURATION ====================

  /**
   * Get all rate limit configurations
   */
  getRateLimits: async () => {
    const response = await api.get("/admin/rate-limits");
    return response.data;
  },

  /**
   * Update rate limit configuration
   * @param {string} role - 'ADMIN', 'MANAGER', or 'USER'
   * @param {number} limit - New limit value
   */
  updateRateLimit: async (role, limit) => {
    const response = await api.put(`/admin/rate-limits/${role}`, { limit });
    return response.data;
  },

  /**
   * Get endpoint-specific rate limits
   */
  getEndpointRateLimits: async () => {
    const response = await api.get("/admin/rate-limits/endpoints");
    return response.data;
  },

  /**
   * Get all available API endpoints (for configuration dropdown)
   */
  getAvailableEndpoints: async () => {
    const response = await api.get("/admin/endpoints");
    return response.data;
  },

  /**
   * Create endpoint rate limit
   * @param {string} endpoint - API endpoint path
   * @param {string} method - HTTP method
   * @param {number} limit - Request limit
   * @param {number} window - Time window in seconds
   */
  createEndpointRateLimit: async (endpoint, method, limit, window) => {
    const response = await api.post("/admin/rate-limits/endpoints", {
      endpoint,
      method,
      limit,
      window,
    });
    return response.data;
  },

  /**
   * Update endpoint rate limit
   * @param {string} id - Config ID
   * @param {object} data - Update data
   */
  updateEndpointRateLimit: async (id, data) => {
    const response = await api.put(`/admin/rate-limits/endpoints/${id}`, data);
    return response.data;
  },

  /**
   * Delete endpoint rate limit
   * @param {string} id - Config ID
   */
  deleteEndpointRateLimit: async (id) => {
    const response = await api.delete(`/admin/rate-limits/endpoints/${id}`);
    return response.data;
  },

  /**
   * Get user-specific rate limits
   */
  getUserRateLimits: async () => {
    const response = await api.get("/admin/rate-limits/users");
    return response.data;
  },

  /**
   * Set user rate limit
   * @param {string} userId - User ID
   * @param {number} limit - Request limit
   * @param {number} window - Time window in seconds
   */
  setUserRateLimit: async (userId, limit, window) => {
    const response = await api.post(`/admin/rate-limits/users/${userId}`, {
      limit,
      window,
    });
    return response.data;
  },

  /**
   * Remove user rate limit
   * @param {string} userId - User ID
   */
  removeUserRateLimit: async (userId) => {
    const response = await api.delete(`/admin/rate-limits/users/${userId}`);
    return response.data;
  },

  // ==================== SYSTEM HEALTH ====================

  /**
   * Get current system health
   */
  getSystemHealth: async () => {
    const response = await api.get("/admin/health");
    return response.data;
  },

  /**
   * Get system health history
   * @param {number} hours - Number of hours to retrieve
   */
  getHealthHistory: async (hours = 24) => {
    const response = await api.get(`/admin/health/history?hours=${hours}`);
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users with stats
   */
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  /**
   * Get user activity details
   * @param {string} userId - User ID
   * @param {number} days - Number of days to retrieve
   */
  getUserDetails: async (userId, days = 7) => {
    const response = await api.get(`/admin/users/${userId}?days=${days}`);
    return response.data;
  },

  /**
   * Update user status (activate/deactivate)
   * @param {string} userId - User ID
   * @param {boolean} isActive - New status
   */
  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} role - New role ('ADMIN', 'MANAGER', 'USER')
   */
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // ==================== AUDIT LOGS ====================

  /**
   * Get audit logs
   * @param {number} limit - Number of logs to return
   */
  getAuditLogs: async (limit = 50) => {
    const response = await api.get(`/admin/audit-logs?limit=${limit}`);
    return response.data;
  },

  // ==================== MAINTENANCE ====================

  /**
   * Clean old logs
   * @param {number} daysToKeep - Number of days to keep
   */
  cleanOldLogs: async (daysToKeep = 90) => {
    const response = await api.delete("/admin/logs/cleanup", {
      data: { daysToKeep },
    });
    return response.data;
  },
};

export default adminApi;
