import React, { useState } from "react";
import { Card, Badge, Button, Container } from "../ui";

const AdminDashboard = ({ user }) => {
  const [activeView, setActiveView] = useState("overview");

  // Show loading state if user is not available
  if (!user) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </Container>
    );
  }

  // Mock data for admin
  const systemStats = {
    totalUsers: 156,
    totalProjects: 25,
    totalTasks: 1243,
    totalExchanges: 89,
    activeUsers: 89,
    systemUptime: "99.9%",
    storageUsed: "2.3 GB",
    apiCalls: 12456,
  };

  const usersByRole = {
    ADMIN: 3,
    MODERATOR: 5,
    MANAGER: 12,
    USER: 136,
  };

  const recentUsers = [
    {
      id: "u1",
      username: "john_new",
      email: "john@company.com",
      role: "USER",
      status: "active",
      lastLogin: "2025-09-23 14:30",
      createdAt: "2025-09-20",
    },
    {
      id: "u2",
      username: "jane_manager",
      email: "jane@company.com",
      role: "MANAGER",
      status: "active",
      lastLogin: "2025-09-23 13:45",
      createdAt: "2025-09-18",
    },
  ];

  const systemAlerts = [
    {
      id: "a1",
      type: "performance",
      message: "Database query performance degraded by 15%",
      severity: "warning",
      timestamp: "2025-09-23 12:00",
    },
    {
      id: "a2",
      type: "security",
      message: "Multiple failed login attempts detected",
      severity: "high",
      timestamp: "2025-09-23 10:30",
    },
  ];

  const handleUserRoleChange = (userId, newRole) => {
    console.log(`Changing user ${userId} role to ${newRole}`);
    // Implement role change logic
  };

  const handleUserDeactivate = (userId) => {
    console.log("Deactivating user:", userId);
    // Implement user deactivation logic
  };

  return (
    <Container>
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              System Administration 🧑‍💻
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="danger">ADMIN</Badge>
              <span className="text-gray-600">
                System Administrator - {user.username}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === "overview" ? "primary" : "secondary"}
              onClick={() => setActiveView("overview")}
            >
              Overview
            </Button>
            <Button
              variant={activeView === "users" ? "primary" : "secondary"}
              onClick={() => setActiveView("users")}
            >
              User Management
            </Button>
            <Button
              variant={activeView === "system" ? "primary" : "secondary"}
              onClick={() => setActiveView("system")}
            >
              System Config
            </Button>
            <Button
              variant={activeView === "analytics" ? "primary" : "secondary"}
              onClick={() => setActiveView("analytics")}
            >
              Analytics
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {systemStats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-xs text-green-600">
                {systemStats.activeUsers} active
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {systemStats.totalProjects}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {systemStats.systemUptime}
              </div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {systemStats.apiCalls.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">API Calls Today</div>
            </div>
          </Card>
        </div>

        {/* Overview Dashboard */}
        {activeView === "overview" && (
          <div className="space-y-6">
            {/* System Alerts */}
            <Card
              title="System Alerts"
              subtitle="Critical system notifications"
            >
              <div className="space-y-3">
                {systemAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-3xl mb-2">✅</div>
                    <p>No system alerts</p>
                  </div>
                ) : (
                  systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.severity === "high"
                          ? "border-red-200 bg-red-50"
                          : alert.severity === "warning"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                alert.severity === "high"
                                  ? "danger"
                                  : alert.severity === "warning"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {alert.type}
                            </span>
                          </div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-500">
                            {alert.timestamp}
                          </p>
                        </div>
                        <Button size="sm" variant="secondary">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* User Distribution */}
            <Card
              title="User Role Distribution"
              subtitle="Current user roles in the system"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(usersByRole).map(([role, count]) => (
                  <div key={role} className="text-center p-4 border rounded-lg">
                    <div
                      className={`text-2xl font-bold ${
                        role === "ADMIN"
                          ? "text-red-600"
                          : role === "MODERATOR"
                            ? "text-yellow-600"
                            : role === "MANAGER"
                              ? "text-green-600"
                              : "text-blue-600"
                      }`}
                    >
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">{role}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Performance */}
            <Card title="System Performance" subtitle="Current system metrics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Storage Usage</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: {systemStats.storageUsed}</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "23%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">CPU Usage</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Memory Usage</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* User Management */}
        {activeView === "users" && (
          <div className="space-y-6">
            <Card
              title="User Management"
              subtitle="Manage system users and their roles"
            >
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-600">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{user.username}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "danger"
                              : user.role === "MODERATOR"
                                ? "warning"
                                : user.role === "MANAGER"
                                  ? "success"
                                  : "primary"
                          }
                        >
                          {user.role}
                        </Badge>
                        <span>Last login: {user.lastLogin}</span>
                        <span>Joined: {user.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        className="px-3 py-1 border rounded text-sm"
                        defaultValue={user.role}
                        onChange={(e) =>
                          handleUserRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUserDeactivate(user.id)}
                      >
                        Deactivate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* System Configuration */}
        {activeView === "system" && (
          <Card
            title="System Configuration"
            subtitle="Configure system-wide settings"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">API Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Rate Limiting</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Versioning</span>
                      <select className="px-3 py-1 border rounded text-sm">
                        <option>v1.0</option>
                        <option>v1.1</option>
                        <option>v2.0 (beta)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Session Timeout (hours)</span>
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded text-sm"
                        defaultValue="24"
                        min="1"
                        max="168"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button variant="primary">Save Configuration</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Analytics */}
        {activeView === "analytics" && (
          <Card
            title="System Analytics"
            subtitle="Comprehensive system usage analytics"
          >
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Advanced Analytics Dashboard
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Detailed analytics and reporting features would be implemented
                here with charts and graphs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">User Growth</div>
                  <div className="text-sm text-gray-600">
                    Monthly user registration trends
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Project Analytics</div>
                  <div className="text-sm text-gray-600">
                    Project completion rates and timelines
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">System Performance</div>
                  <div className="text-sm text-gray-600">
                    Server metrics and optimization insights
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default AdminDashboard;
