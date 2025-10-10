import React from "react";
import { Card } from "../ui";
import { useTheme } from "../../context";

const ManagerAnalytics = ({
  tasks = [],
  projects = [],
  teamMembers = [],
  exchangeLogs = [],
  tasksAwaitingApproval = [],
}) => {
  const { isDark } = useTheme();

  // Team performance metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const pendingTasks = tasks.filter((task) => task.status === "PENDING");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  // Calculate overall completion rate
  const overallCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Project completion rates
  const projectStats = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const projectCompleted = projectTasks.filter(
      (task) => task.status === "COMPLETED"
    );
    const completionRate =
      projectTasks.length > 0
        ? Math.round((projectCompleted.length / projectTasks.length) * 100)
        : 0;

    return {
      ...project,
      totalTasks: projectTasks.length,
      completedTasks: projectCompleted.length,
      completionRate,
    };
  });

  // Team member performance
  const teamStats = teamMembers.map((member) => {
    const memberTasks = tasks.filter((task) => task.assigneeId === member.id);
    const memberCompleted = memberTasks.filter(
      (task) => task.status === "COMPLETED"
    );
    const memberInProgress = memberTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    );

    return {
      ...member,
      totalTasks: memberTasks.length,
      completedTasks: memberCompleted.length,
      inProgressTasks: memberInProgress.length,
      completionRate:
        memberTasks.length > 0
          ? Math.round((memberCompleted.length / memberTasks.length) * 100)
          : 0,
    };
  });

  // This week's activity
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const thisWeekCompleted = tasks.filter(
    (task) =>
      task.status === "COMPLETED" &&
      task.updatedAt &&
      new Date(task.updatedAt) >= thisWeek
  ).length;

  const thisWeekExchanges = exchangeLogs.filter(
    (exchange) =>
      exchange.requestedAt && new Date(exchange.requestedAt) >= thisWeek
  ).length;

  // Approval metrics
  const approvalsPending = tasksAwaitingApproval.length;
  const avgApprovalTime = "1.5 days"; // Mock data

  // Workload distribution
  const workloadBalance =
    teamMembers.length > 0
      ? {
          overloaded: teamStats.filter((member) => member.totalTasks > 8)
            .length,
          balanced: teamStats.filter(
            (member) => member.totalTasks >= 3 && member.totalTasks <= 8
          ).length,
          underutilized: teamStats.filter((member) => member.totalTasks < 3)
            .length,
        }
      : { overloaded: 0, balanced: 0, underutilized: 0 };

  // Recent trends
  const exchangeAcceptanceRate =
    exchangeLogs.length > 0
      ? Math.round(
          (exchangeLogs.filter((ex) => ex.status === "ACCEPTED").length /
            exchangeLogs.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Management Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {overallCompletionRate}%
            </div>
            <div
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Team Completion Rate
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {thisWeekCompleted}
            </div>
            <div
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Completed This Week
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {approvalsPending}
            </div>
            <div
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Pending Approvals
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {thisWeekExchanges}
            </div>
            <div
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Task Exchanges
            </div>
          </div>
        </Card>
      </div>

      {/* Team Performance and Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Team Performance"
          subtitle="Individual team member metrics"
        >
          <div className="space-y-4">
            {teamStats.length === 0 ? (
              <div
                className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                <p>No team members data available</p>
              </div>
            ) : (
              teamStats.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${isDark ? "bg-blue-600" : "bg-blue-500"} rounded-full flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {member.name}
                      </div>
                      <div
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {member.totalTasks} tasks • {member.completionRate}%
                        complete
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-16 h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
                    >
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${member.completionRate}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {member.completionRate}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Project Status" subtitle="Project completion overview">
          <div className="space-y-4">
            {projectStats.length === 0 ? (
              <div
                className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                <p>No projects data available</p>
              </div>
            ) : (
              projectStats.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {project.name}
                    </div>
                    <div
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {project.completedTasks}/{project.totalTasks} tasks
                      completed
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-20 h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
                    >
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${project.completionRate}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {project.completionRate}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Workload and Task Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Workload Distribution" subtitle="Team resource allocation">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Overloaded (8+ tasks)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {workloadBalance.overloaded} members
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Balanced (3-8 tasks)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {workloadBalance.balanced} members
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Underutilized (&lt;3 tasks)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {workloadBalance.underutilized} members
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Task Flow Metrics" subtitle="Task progression analytics">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingTasks.length}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Pending
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {inProgressTasks.length}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  In Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {doneTasks.length}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Awaiting Review
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedTasks.length}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Completed
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Management Insights */}
      <Card
        title="Management Insights"
        subtitle="Key metrics and recommendations"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4
              className={`font-medium mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              📊 Key Metrics
            </h4>
            <div className="space-y-2">
              <div
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                • Average approval time: {avgApprovalTime}
              </div>
              <div
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                • Task exchange acceptance rate: {exchangeAcceptanceRate}%
              </div>
              <div
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                • Team utilization:{" "}
                {Math.round(
                  ((workloadBalance.balanced + workloadBalance.overloaded) /
                    (teamMembers.length || 1)) *
                    100
                )}
                %
              </div>
              <div
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                • Active projects: {projects.length}
              </div>
            </div>
          </div>

          <div>
            <h4
              className={`font-medium mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              💡 Recommendations
            </h4>
            <div className="space-y-2">
              {workloadBalance.overloaded > 0 && (
                <div
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  • Redistribute tasks from overloaded team members
                </div>
              )}
              {workloadBalance.underutilized > 0 && (
                <div
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  • Assign more tasks to underutilized team members
                </div>
              )}
              {approvalsPending > 5 && (
                <div
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  • Review pending approvals to maintain team momentum
                </div>
              )}
              {overallCompletionRate < 70 && (
                <div
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  • Focus on improving team completion rates
                </div>
              )}
              {exchangeAcceptanceRate < 60 && (
                <div
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  • Review task exchange policies and communication
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManagerAnalytics;
