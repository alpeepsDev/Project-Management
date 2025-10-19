import { useState, useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { useTheme } from "../../context";
import {
  Activity,
  Users,
  Settings,
  TrendingUp,
  Shield,
  RefreshCw,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import RateLimitConfigModal from "../modals/RateLimitConfigModal";
import Button from "../ui/Button";

const AdminDashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    isAdmin,
    loading,
    error,
    apiStats,
    systemHealth,
    users,
    rateLimits,
    endpointLimits,
    userLimits,
    userActivity,
    fetchApiStats,
    fetchSystemHealth,
    fetchUsers,
    fetchRateLimits,
    fetchEndpointLimits,
    fetchUserLimits,
    fetchUserActivity,
    updateRateLimit,
    createEndpointLimit,
    updateEndpointLimit,
    deleteEndpointLimit,
    setUserLimit,
    removeUserLimit,
    availableEndpoints,
    fetchAvailableEndpoints,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Rate Limit Config Modal State
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    type: null, // 'role', 'user', or 'endpoint'
    data: null,
  });

  // Load data on mount
  useEffect(() => {
    if (isAdmin) {
      fetchApiStats();
      fetchSystemHealth();
      fetchUsers();
      fetchRateLimits();
      fetchEndpointLimits();
      fetchUserLimits();
      fetchUserActivity();
      fetchAvailableEndpoints();
    }
  }, [
    isAdmin,
    fetchApiStats,
    fetchSystemHealth,
    fetchUsers,
    fetchRateLimits,
    fetchEndpointLimits,
    fetchUserLimits,
    fetchUserActivity,
    fetchAvailableEndpoints,
  ]);

  // Auto-refresh overview tab every 30 seconds
  useEffect(() => {
    if (isAdmin && activeTab === "overview") {
      const interval = setInterval(() => {
        fetchApiStats();
        fetchSystemHealth();
        setLastUpdate(new Date());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAdmin, activeTab, fetchApiStats, fetchSystemHealth]);

  // Auto-refresh monitoring tab every 30 seconds
  useEffect(() => {
    if (isAdmin && activeTab === "monitoring") {
      const interval = setInterval(() => {
        fetchUserActivity();
        fetchApiStats();
        setLastUpdate(new Date());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAdmin, activeTab, fetchUserActivity, fetchApiStats]);

  // Auto-refresh rate limits tab every 30 seconds
  useEffect(() => {
    if (isAdmin && activeTab === "ratelimits") {
      const interval = setInterval(() => {
        fetchRateLimits();
        fetchEndpointLimits();
        fetchUserLimits();
        setLastUpdate(new Date());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [
    isAdmin,
    activeTab,
    fetchRateLimits,
    fetchEndpointLimits,
    fetchUserLimits,
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchApiStats(),
      fetchSystemHealth(),
      fetchUsers(),
      fetchRateLimits(),
      fetchEndpointLimits(),
      fetchUserLimits(),
      fetchUserActivity(),
    ]);
    setLastUpdate(new Date());
    setRefreshing(false);
  };

  const handleSaveRateLimit = async (formData) => {
    try {
      if (configModal.type === "role") {
        await updateRateLimit(formData.role, formData.limit);
      } else if (configModal.type === "user") {
        await setUserLimit(formData.userId, formData.limit, formData.window);
      } else if (configModal.type === "endpoint") {
        if (configModal.data?.id) {
          await updateEndpointLimit(configModal.data.id, {
            limit: formData.limit,
            window: formData.window,
          });
        } else {
          await createEndpointLimit(
            formData.endpoint,
            formData.method,
            formData.limit,
            formData.window
          );
        }
      }
      setConfigModal({ isOpen: false, type: null, data: null });
    } catch (error) {
      console.error("Failed to save rate limit:", error);
    }
  };

  const handleDeleteEndpointLimit = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this endpoint limit?")
    ) {
      try {
        await deleteEndpointLimit(id);
      } catch (error) {
        console.error("Failed to delete endpoint limit:", error);
      }
    }
  };

  const handleRemoveUserLimit = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this user's custom rate limit?"
      )
    ) {
      try {
        await removeUserLimit(userId);
      } catch (error) {
        console.error("Failed to remove user limit:", error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div
        className={`p-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <p className={`${isDark ? "text-red-400" : "text-red-600"}`}>
          Access Denied: Admin privileges required
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className={`text-3xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <Shield className="w-8 h-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              System monitoring and management
            </p>
            <p
              className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh:
              30s
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw
                className={refreshing ? "animate-spin w-4 h-4" : "w-4 h-4"}
              />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div
            className={`px-4 py-3 rounded-lg mb-6 ${
              isDark
                ? "bg-red-900/50 border border-red-800 text-red-200"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            <p>{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "monitoring", label: "API Monitoring", icon: TrendingUp },
            { id: "ratelimits", label: "Rate Limits", icon: Settings },
            { id: "users", label: "User Management", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div
                  className={`rounded-lg shadow p-6 transition-all duration-300 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Total Requests
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 transition-all duration-500 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {apiStats?.totalRequests?.toLocaleString() || "0"}
                  </p>
                  <p className="text-green-600 text-sm mt-1 transition-all duration-500">
                    {apiStats?.requestsToday || 0} today
                  </p>
                </div>
                <div
                  className={`rounded-lg shadow p-6 transition-all duration-300 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Avg Response Time
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 transition-all duration-500 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {apiStats?.averageResponseTime || 0}
                    <span className="text-lg">ms</span>
                  </p>
                </div>
                <div
                  className={`rounded-lg shadow p-6 transition-all duration-300 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Error Rate
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 transition-all duration-500 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {apiStats?.errorRate || 0}%
                  </p>
                </div>
                <div
                  className={`rounded-lg shadow p-6 transition-all duration-300 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    System Status
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 capitalize transition-all duration-500 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {systemHealth?.status || "Unknown"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "monitoring" && (
              <div className="space-y-6">
                {/* Top Endpoints */}
                <div
                  className={`rounded-lg shadow p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Top Endpoints
                  </h3>
                  {apiStats?.topEndpoints?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead
                          className={isDark ? "bg-gray-700" : "bg-gray-50"}
                        >
                          <tr>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Endpoint
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Requests
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Avg Time
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
                        >
                          {apiStats.topEndpoints.map((endpoint, idx) => (
                            <tr
                              key={idx}
                              className={
                                isDark
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                              >
                                {endpoint.endpoint}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {endpoint.count.toLocaleString()}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {endpoint.avgTime}ms
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      No API data available yet. Data will appear as requests
                      are made.
                    </p>
                  )}
                </div>

                {/* User Activity */}
                <div
                  className={`rounded-lg shadow p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    User Activity (Last 24h)
                  </h3>
                  {userActivity?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead
                          className={isDark ? "bg-gray-700" : "bg-gray-50"}
                        >
                          <tr>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Username
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Email
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Role
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Requests
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Rate Limit
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Usage
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
                        >
                          {userActivity.map((user) => (
                            <tr
                              key={user.userId}
                              className={
                                isDark
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                              >
                                {user.username}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {user.email}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    user.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-800"
                                      : user.role === "MANAGER"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {user.requestCount}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {user.rateLimit}/hr
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-24 rounded-full h-2 ${
                                      isDark ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                                  >
                                    <div
                                      className={`h-2 rounded-full ${
                                        parseFloat(user.percentage) > 90
                                          ? "bg-red-600"
                                          : parseFloat(user.percentage) > 75
                                            ? "bg-yellow-600"
                                            : "bg-green-600"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          parseFloat(user.percentage),
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span
                                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    {user.percentage}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      No user activity in the last 24 hours.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "ratelimits" && (
              <div className="space-y-6">
                {/* Per-Role Limits */}
                <div
                  className={`rounded-lg shadow p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Per-Role Rate Limits
                    </h3>
                  </div>
                  {rateLimits?.length > 0 ? (
                    <div className="space-y-4">
                      {rateLimits.map((config) => (
                        <div
                          key={config.role}
                          className={`border rounded-lg p-4 ${
                            isDark ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    config.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-800"
                                      : config.role === "MANAGER"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {config.role}
                                </span>
                                <span
                                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                  {config.limit}
                                </span>
                                <span
                                  className={
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }
                                >
                                  requests/hour
                                </span>
                              </div>
                              <div className="mt-2">
                                <div
                                  className={`flex justify-between text-sm mb-1 ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  <span>Current Usage</span>
                                  <span>
                                    {config.currentUsage || 0} / {config.limit}
                                  </span>
                                </div>
                                <div
                                  className={`w-full rounded-full h-2 ${
                                    isDark ? "bg-gray-700" : "bg-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`h-2 rounded-full ${
                                      parseFloat(config.percentage || 0) > 90
                                        ? "bg-red-600"
                                        : parseFloat(config.percentage || 0) >
                                            75
                                          ? "bg-yellow-600"
                                          : "bg-green-600"
                                    }`}
                                    style={{
                                      width: `${Math.min(
                                        parseFloat(config.percentage || 0),
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setConfigModal({
                                  isOpen: true,
                                  type: "role",
                                  data: config,
                                })
                              }
                              className="ml-4"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      No rate limit configurations found.
                    </p>
                  )}
                </div>

                {/* Per-User Limits */}
                <div
                  className={`rounded-lg shadow p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Per-User Rate Limits
                    </h3>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        setConfigModal({
                          isOpen: true,
                          type: "user",
                          data: null,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Set User Limit
                    </Button>
                  </div>
                  {userLimits?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead
                          className={isDark ? "bg-gray-700" : "bg-gray-50"}
                        >
                          <tr>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              User
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Limit
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Window
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
                        >
                          {userLimits.map((limit) => (
                            <tr
                              key={limit.userId}
                              className={
                                isDark
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                              >
                                {limit.user?.username || "Unknown"}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {limit.limit} req
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {limit.window}s
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveUserLimit(limit.userId)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      No user-specific rate limits configured.
                    </p>
                  )}
                </div>

                {/* Endpoint Throttling */}
                <div
                  className={`rounded-lg shadow p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Endpoint Throttling
                    </h3>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        setConfigModal({
                          isOpen: true,
                          type: "endpoint",
                          data: null,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Configure Endpoint
                    </Button>
                  </div>
                  {endpointLimits?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead
                          className={isDark ? "bg-gray-700" : "bg-gray-50"}
                        >
                          <tr>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Endpoint
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Method
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Limit
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Usage
                            </th>
                            <th
                              className={`px-4 py-2 text-left text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
                        >
                          {endpointLimits.map((limit) => (
                            <tr
                              key={limit.id}
                              className={
                                isDark
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td
                                className={`px-4 py-3 text-sm font-mono ${isDark ? "text-gray-200" : "text-gray-900"}`}
                              >
                                {limit.endpoint}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    limit.method === "*"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {limit.method}
                                </span>
                              </td>
                              <td
                                className={`px-4 py-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {limit.limit}/{limit.window}s
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-20 rounded-full h-2 ${
                                      isDark ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                                  >
                                    <div
                                      className={`h-2 rounded-full ${
                                        parseFloat(limit.percentage || 0) > 90
                                          ? "bg-red-600"
                                          : parseFloat(limit.percentage || 0) >
                                              75
                                            ? "bg-yellow-600"
                                            : "bg-green-600"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          parseFloat(limit.percentage || 0),
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span
                                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    {limit.percentage || 0}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setConfigModal({
                                        isOpen: true,
                                        type: "endpoint",
                                        data: limit,
                                      })
                                    }
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteEndpointLimit(limit.id)
                                    }
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p
                      className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      No endpoint throttling configured.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div
                className={`rounded-lg shadow overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="p-6">
                  <h3
                    className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    All Users
                  </h3>
                  <p
                    className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Total users: {users?.length || 0}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                      <tr>
                        <th
                          className={`px-6 py-3 text-left text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Username
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Email
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Role
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}
                    >
                      {users?.map((user) => (
                        <tr
                          key={user.id}
                          className={
                            isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          }
                        >
                          <td
                            className={`px-6 py-4 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                          >
                            {user.username}
                          </td>
                          <td
                            className={`px-6 py-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rate Limit Config Modal */}
      <RateLimitConfigModal
        isOpen={configModal.isOpen}
        onClose={() =>
          setConfigModal({ isOpen: false, type: null, data: null })
        }
        type={configModal.type}
        onSave={handleSaveRateLimit}
        initialData={configModal.data}
        users={users}
        endpoints={availableEndpoints}
      />
    </div>
  );
};

export default AdminDashboard;
