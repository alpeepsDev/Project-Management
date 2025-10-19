import { useState, useCallback } from "react";
import adminApi from "../api/admin";
import { useAuth } from "../context/AuthContext";

export const useAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Monitoring State
  const [apiStats, setApiStats] = useState(null);
  const [userActivity, setUserActivity] = useState([]);

  // Rate Limit State
  const [rateLimits, setRateLimits] = useState([]);
  const [endpointLimits, setEndpointLimits] = useState([]);
  const [userLimits, setUserLimits] = useState([]);
  const [availableEndpoints, setAvailableEndpoints] = useState([]);

  // System Health State
  const [systemHealth, setSystemHealth] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);

  // User Management State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);

  // Check if user is admin
  const isAdmin = user?.role === "ADMIN";

  // ==================== API MONITORING ====================

  const fetchApiStats = useCallback(
    async (timeRange = "24h") => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getApiStats(timeRange);
        setApiStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch API stats");
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  const fetchUserActivity = useCallback(
    async (limit = 10) => {
      if (!isAdmin) return;
      try {
        const data = await adminApi.getUserActivity(limit);
        setUserActivity(data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch user activity"
        );
      }
    },
    [isAdmin]
  );

  // ==================== RATE LIMIT CONFIGURATION ====================

  const fetchRateLimits = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getRateLimits();
      setRateLimits(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rate limits");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const updateRateLimit = useCallback(
    async (role, limit) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.updateRateLimit(role, limit);
        // Refresh rate limits
        await fetchRateLimits();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update rate limit");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchRateLimits]
  );

  const fetchEndpointLimits = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await adminApi.getEndpointRateLimits();
      setEndpointLimits(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch endpoint limits"
      );
    }
  }, [isAdmin]);

  const fetchAvailableEndpoints = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await adminApi.getAvailableEndpoints();
      setAvailableEndpoints(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch endpoints");
    }
  }, [isAdmin]);

  const createEndpointLimit = useCallback(
    async (endpoint, method, limit, window) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.createEndpointRateLimit(
          endpoint,
          method,
          limit,
          window
        );
        await fetchEndpointLimits();
        return data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to create endpoint limit"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchEndpointLimits]
  );

  const updateEndpointLimit = useCallback(
    async (id, updateData) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.updateEndpointRateLimit(id, updateData);
        await fetchEndpointLimits();
        return data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to update endpoint limit"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchEndpointLimits]
  );

  const deleteEndpointLimit = useCallback(
    async (id) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.deleteEndpointRateLimit(id);
        await fetchEndpointLimits();
        return data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete endpoint limit"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchEndpointLimits]
  );

  const fetchUserLimits = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await adminApi.getUserRateLimits();
      setUserLimits(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user limits");
    }
  }, [isAdmin]);

  const setUserLimit = useCallback(
    async (userId, limit, window) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.setUserRateLimit(userId, limit, window);
        await fetchUserLimits();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to set user limit");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchUserLimits]
  );

  const removeUserLimit = useCallback(
    async (userId) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.removeUserRateLimit(userId);
        await fetchUserLimits();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to remove user limit");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchUserLimits]
  );

  // ==================== SYSTEM HEALTH ====================

  const fetchSystemHealth = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getSystemHealth();
      setSystemHealth(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch system health");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchHealthHistory = useCallback(
    async (hours = 24) => {
      if (!isAdmin) return;
      try {
        const data = await adminApi.getHealthHistory(hours);
        setHealthHistory(data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch health history"
        );
      }
    },
    [isAdmin]
  );

  // ==================== USER MANAGEMENT ====================

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUserDetails = useCallback(
    async (userId, days = 7) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getUserDetails(userId, days);
        setSelectedUser(data.data);
        return data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  const updateUserStatus = useCallback(
    async (userId, isActive) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.updateUserStatus(userId, isActive);
        // Refresh users list
        await fetchUsers();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update user status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchUsers]
  );

  const updateUserRole = useCallback(
    async (userId, role) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.updateUserRole(userId, role);
        // Refresh users list
        await fetchUsers();
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update user role");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, fetchUsers]
  );

  // ==================== AUDIT LOGS ====================

  const fetchAuditLogs = useCallback(
    async (limit = 50) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getAuditLogs(limit);
        setAuditLogs(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  // ==================== MAINTENANCE ====================

  const cleanOldLogs = useCallback(
    async (daysToKeep = 90) => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.cleanOldLogs(daysToKeep);
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to clean old logs");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  return {
    // State
    loading,
    error,
    isAdmin,

    // API Monitoring
    apiStats,
    userActivity,
    fetchApiStats,
    fetchUserActivity,

    // Rate Limiting
    rateLimits,
    endpointLimits,
    userLimits,
    availableEndpoints,
    fetchRateLimits,
    updateRateLimit,
    fetchEndpointLimits,
    createEndpointLimit,
    updateEndpointLimit,
    deleteEndpointLimit,
    fetchAvailableEndpoints,
    fetchUserLimits,
    setUserLimit,
    removeUserLimit,

    // System Health
    systemHealth,
    healthHistory,
    fetchSystemHealth,
    fetchHealthHistory,

    // User Management
    users,
    selectedUser,
    fetchUsers,
    fetchUserDetails,
    updateUserStatus,
    updateUserRole,

    // Audit Logs
    auditLogs,
    fetchAuditLogs,

    // Maintenance
    cleanOldLogs,
  };
};
