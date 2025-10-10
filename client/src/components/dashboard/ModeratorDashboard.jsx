import React, { useState } from "react";
import { Card, Badge, Button, Container } from "../ui";

const ModeratorDashboard = ({ user }) => {
  const [activeView, setActiveView] = useState("monitoring");

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

  // Mock data for moderation
  const flaggedItems = [
    {
      id: "f1",
      type: "task_exchange",
      title: "Suspicious task exchange pattern",
      description: "User repeatedly requesting exchanges without valid reasons",
      reporter: "system",
      flaggedUser: "problematic_user",
      project: "Web App Redesign",
      severity: "HIGH",
      createdAt: "2025-09-23",
      status: "PENDING",
    },
    {
      id: "f2",
      type: "task_comment",
      title: "Inappropriate comment content",
      description: "Comment contains unprofessional language",
      reporter: "jane_dev",
      flaggedUser: "toxic_user",
      project: "Mobile App Development",
      severity: "MEDIUM",
      createdAt: "2025-09-22",
      status: "PENDING",
    },
  ];

  const systemStats = {
    totalProjects: 25,
    totalUsers: 156,
    totalTasks: 1243,
    totalExchanges: 89,
    flaggedItems: flaggedItems.length,
    resolvedFlags: 23,
  };

  const recentActivity = [
    {
      id: "a1",
      type: "task_exchange",
      description: "john_dev requested exchange with jane_dev",
      project: "Web App Redesign",
      timestamp: "2025-09-23 14:30",
      status: "normal",
    },
    {
      id: "a2",
      type: "task_completion",
      description: 'alice_mobile completed "Setup project structure"',
      project: "Mobile App Development",
      timestamp: "2025-09-23 13:45",
      status: "normal",
    },
    {
      id: "a3",
      type: "multiple_exchanges",
      description: "problematic_user made 5 exchange requests in 1 hour",
      project: "Various",
      timestamp: "2025-09-23 12:00",
      status: "suspicious",
    },
  ];

  const handleFlagAction = (flagId, action) => {
    console.log(`${action} flag ${flagId}`);
    // Implement flag resolution logic
  };

  const handleSuspendExchange = (exchangeId) => {
    console.log("Suspending exchange:", exchangeId);
    // Implement exchange suspension logic
  };

  return (
    <Container>
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Moderator Dashboard 🛡️
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="warning">MODERATOR</Badge>
              <span className="text-gray-600">
                Content Moderator - {user.username}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === "monitoring" ? "primary" : "secondary"}
              onClick={() => setActiveView("monitoring")}
            >
              Monitoring
            </Button>
            <Button
              variant={activeView === "flags" ? "primary" : "secondary"}
              onClick={() => setActiveView("flags")}
            >
              Flagged Items ({flaggedItems.length})
            </Button>
            <Button
              variant={activeView === "analytics" ? "primary" : "secondary"}
              onClick={() => setActiveView("analytics")}
            >
              Analytics
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {systemStats.totalProjects}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {systemStats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {systemStats.totalTasks}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {systemStats.totalExchanges}
              </div>
              <div className="text-sm text-gray-600">Task Exchanges</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {systemStats.flaggedItems}
              </div>
              <div className="text-sm text-gray-600">Flagged Items</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {systemStats.resolvedFlags}
              </div>
              <div className="text-sm text-gray-600">Resolved Flags</div>
            </div>
          </Card>
        </div>

        {/* Monitoring View */}
        {activeView === "monitoring" && (
          <div className="space-y-6">
            <Card
              title="Real-time Activity Monitor"
              subtitle="Monitor system-wide activity"
            >
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      activity.status === "suspicious"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "suspicious"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        ></span>
                        <h5 className="font-medium">{activity.description}</h5>
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.project} • {activity.timestamp}
                      </div>
                    </div>
                    {activity.status === "suspicious" && (
                      <Button size="sm" variant="warning">
                        Flag for Review
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="System Health" subtitle="Current system status">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-green-500 text-2xl mb-2">✅</div>
                  <div className="font-medium">System Status</div>
                  <div className="text-sm text-gray-600">
                    All systems operational
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-yellow-500 text-2xl mb-2">⚠️</div>
                  <div className="font-medium">Alert Level</div>
                  <div className="text-sm text-gray-600">
                    Low - {flaggedItems.length} items flagged
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-blue-500 text-2xl mb-2">📊</div>
                  <div className="font-medium">Activity Level</div>
                  <div className="text-sm text-gray-600">
                    Normal - Active monitoring
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Flagged Items View */}
        {activeView === "flags" && (
          <Card
            title="Flagged Items"
            subtitle="Review and resolve flagged content"
          >
            <div className="space-y-4">
              {flaggedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">🎯</div>
                  <p>No items currently flagged</p>
                  <p className="text-sm mt-1">System is clean!</p>
                </div>
              ) : (
                flaggedItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              item.severity === "HIGH"
                                ? "danger"
                                : item.severity === "MEDIUM"
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {item.severity}
                          </Badge>
                          <Badge variant="secondary">
                            {item.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          Flagged user:{" "}
                          <span className="font-medium">
                            {item.flaggedUser}
                          </span>{" "}
                          • Reporter:{" "}
                          <span className="font-medium">{item.reporter}</span> •
                          Project:{" "}
                          <span className="font-medium">{item.project}</span> •
                          {item.createdAt}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleFlagAction(item.id, "resolve")}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleFlagAction(item.id, "escalate")}
                        >
                          Escalate
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleSuspendExchange(item.id)}
                        >
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Analytics View */}
        {activeView === "analytics" && (
          <div className="space-y-6">
            <Card
              title="Moderation Analytics"
              subtitle="System usage and moderation statistics"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Flag Resolution Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resolved</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Response Time</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average: 2.3 hours</span>
                      <span>Target: &lt; 4 hours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Trend Analysis" subtitle="Weekly moderation trends">
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">📈</div>
                <p>Analytics charts would be implemented here</p>
                <p className="text-sm mt-1">
                  Integration with charting library needed
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ModeratorDashboard;
