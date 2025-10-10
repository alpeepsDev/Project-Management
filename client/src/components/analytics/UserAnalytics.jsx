import React, { useState, useMemo, useCallback } from "react";
import { Card } from "../ui";
import { useTheme } from "../../context";

const UserAnalytics = ({ tasks = [], user }) => {
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate user-specific metrics
  const myTasks = useMemo(
    () => tasks.filter((task) => task.assigneeId === user?.id) || [],
    [tasks, user?.id],
  );
  const completedTasks = myTasks.filter((task) => task.status === "COMPLETED");
  const inProgressTasks = myTasks.filter(
    (task) => task.status === "IN_PROGRESS",
  );
  const pendingTasks = myTasks.filter((task) => task.status === "PENDING");

  // Enhanced analytics calculations
  const analytics = useMemo(() => {
    const totalTasks = myTasks.length;
    const completionRate =
      totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Calculate average completion time
    const completedWithDates = completedTasks.filter(
      (task) => task.createdAt && task.updatedAt,
    );
    const avgCompletionTime =
      completedWithDates.length > 0
        ? completedWithDates.reduce((sum, task) => {
            const created = new Date(task.createdAt);
            const completed = new Date(task.updatedAt);
            return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
          }, 0) / completedWithDates.length
        : 0;

    // Priority breakdown
    const priorityBreakdown = {
      HIGH: myTasks.filter((task) => task.priority === "HIGH").length,
      MEDIUM: myTasks.filter((task) => task.priority === "MEDIUM").length,
      LOW: myTasks.filter((task) => task.priority === "LOW").length,
    };

    // Weekly productivity (simulated for demo)
    const productivityTrend = [
      { day: "Mon", completed: Math.floor(Math.random() * 5) + 1, target: 4 },
      { day: "Tue", completed: Math.floor(Math.random() * 5) + 1, target: 4 },
      { day: "Wed", completed: Math.floor(Math.random() * 6) + 2, target: 4 },
      { day: "Thu", completed: Math.floor(Math.random() * 5) + 2, target: 4 },
      { day: "Fri", completed: Math.floor(Math.random() * 7) + 1, target: 4 },
      { day: "Sat", completed: Math.floor(Math.random() * 3) + 1, target: 3 },
      { day: "Sun", completed: Math.floor(Math.random() * 2) + 1, target: 2 },
    ];

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate,
      avgCompletionTime,
      priorityBreakdown,
      productivityTrend,
    };
  }, [myTasks, completedTasks, inProgressTasks, pendingTasks]);

  // Enhanced progress bar component
  const ProgressBar = useCallback(
    ({
      value,
      max,
      color = "blue",
      showPercentage = true,
      height = "h-2",
      animated = true,
    }) => {
      const percentage = Math.round((value / max) * 100);
      const safePercentage = Math.min(percentage, 100);

      return (
        <div className="w-full">
          <div
            className={`w-full ${height} ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
          >
            <div
              className={`${height} ${animated ? "transition-all duration-500 ease-out" : ""} rounded-full ${
                color === "blue"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : color === "green"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : color === "yellow"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : color === "red"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-purple-500 to-purple-600"
              }`}
              style={{ width: `${safePercentage}%` }}
            />
          </div>
          {showPercentage && (
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1 block font-medium`}
            >
              {percentage}%
            </span>
          )}
        </div>
      );
    },
    [isDark],
  );

  // Metric cards data with enhanced styling
  const metricCards = useMemo(
    () => [
      {
        title: "Total Tasks",
        value: analytics.totalTasks,
        change: "+12%",
        trend: "up",
        icon: "📋",
        color: "blue",
        description: "All assigned tasks",
      },
      {
        title: "Completed",
        value: analytics.completedTasks,
        change: "+8%",
        trend: "up",
        icon: "✅",
        color: "green",
        description: "Successfully finished",
      },
      {
        title: "In Progress",
        value: analytics.inProgressTasks,
        change: "-5%",
        trend: "down",
        icon: "⏳",
        color: "yellow",
        description: "Currently working on",
      },
      {
        title: "Completion Rate",
        value: `${Math.round(analytics.completionRate)}%`,
        change: "+15%",
        trend: "up",
        icon: "🎯",
        color: "purple",
        description: "Overall success rate",
      },
    ],
    [analytics],
  );

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`text-3xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-blue-400 to-purple-400"
                : "from-blue-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Personal Analytics
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-2`}
          >
            Track your productivity and performance metrics •{" "}
            {user?.name || "User"}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card
            key={index}
            className={`p-6 transform transition-all duration-300 border-0 shadow-lg ${
              isDark
                ? "bg-gray-800/80 backdrop-blur"
                : "bg-white/80 backdrop-blur"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"} mb-1`}
                >
                  {metric.title}
                </p>
                <p
                  className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
                >
                  {metric.value}
                </p>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      metric.trend === "up"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {metric.change}
                  </span>
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    vs last period
                  </span>
                </div>
                <p
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {metric.description}
                </p>
              </div>
              <div className="text-3xl ml-4">{metric.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <Card
          className={`p-6 ${isDark ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur border-0 shadow-lg`}
        >
          <h3
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
          >
            <span className="text-xl">📊</span>
            Task Status Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Completed
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 mx-4">
                <ProgressBar
                  value={analytics.completedTasks}
                  max={analytics.totalTasks}
                  color="green"
                  showPercentage={false}
                />
              </div>
              <span
                className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {analytics.completedTasks}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  In Progress
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 mx-4">
                <ProgressBar
                  value={analytics.inProgressTasks}
                  max={analytics.totalTasks}
                  color="yellow"
                  showPercentage={false}
                />
              </div>
              <span
                className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {analytics.inProgressTasks}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 mx-4">
                <ProgressBar
                  value={analytics.pendingTasks}
                  max={analytics.totalTasks}
                  color="red"
                  showPercentage={false}
                />
              </div>
              <span
                className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {analytics.pendingTasks}
              </span>
            </div>
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card
          className={`p-6 ${isDark ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur border-0 shadow-lg`}
        >
          <h3
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
          >
            <span className="text-xl">🎯</span>
            Priority Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  High Priority
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDark
                      ? "bg-red-900 text-red-300"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {analytics.priorityBreakdown.HIGH}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Medium Priority
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDark
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {analytics.priorityBreakdown.MEDIUM}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Low Priority
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDark
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {analytics.priorityBreakdown.LOW}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Productivity Trend */}
      <Card
        className={`p-6 ${isDark ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur border-0 shadow-lg`}
      >
        <h3
          className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
        >
          <span className="text-xl">📈</span>
          Weekly Productivity Trend
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {analytics.productivityTrend.map((day, index) => {
            const maxValue = Math.max(
              ...analytics.productivityTrend.map((d) =>
                Math.max(d.completed, d.target),
              ),
            );
            const completedHeight = (day.completed / maxValue) * 100;
            const targetHeight = (day.target / maxValue) * 100;

            return (
              <div key={index} className="text-center">
                <div
                  className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} mb-3`}
                >
                  {day.day}
                </div>
                <div className="relative h-32 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  {/* Target line */}
                  <div
                    className="absolute w-full border-2 border-dashed border-gray-400 dark:border-gray-500"
                    style={{ bottom: `${targetHeight}%` }}
                  />
                  {/* Completed bar */}
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-xl transition-all duration-700 ease-out"
                    style={{ height: `${completedHeight}%` }}
                  />
                  {/* Glow effect */}
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400/50 to-transparent rounded-xl blur-sm"
                    style={{ height: `${completedHeight}%` }}
                  />
                </div>
                <div
                  className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-gray-700"} mt-2`}
                >
                  {day.completed}/{day.target}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
            <span
              className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"></div>
            <span
              className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Target
            </span>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card
        className={`p-6 ${isDark ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur border-0 shadow-lg`}
      >
        <h3
          className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
        >
          <span className="text-xl">💡</span>
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4
              className={`text-sm font-semibold ${isDark ? "text-green-400" : "text-green-600"} mb-4 flex items-center gap-2`}
            >
              <span className="text-lg">✨</span>
              Strengths
            </h4>
            <ul className="space-y-3">
              <li
                className={`text-sm ${isDark ? "text-green-400" : "text-green-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>High completion rate for priority tasks</span>
              </li>
              <li
                className={`text-sm ${isDark ? "text-green-400" : "text-green-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Consistent daily productivity above 85%</span>
              </li>
              <li
                className={`text-sm ${isDark ? "text-green-400" : "text-green-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Effective time management and task prioritization</span>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className={`text-sm font-semibold ${isDark ? "text-yellow-400" : "text-yellow-600"} mb-4 flex items-center gap-2`}
            >
              <span className="text-lg">🎯</span>
              Growth Opportunities
            </h4>
            <ul className="space-y-3">
              <li
                className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Reduce pending task backlog by 20%</span>
              </li>
              <li
                className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Focus more on medium-priority tasks completion</span>
              </li>
              <li
                className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"} flex items-start gap-3`}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Improve weekend productivity consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserAnalytics;
