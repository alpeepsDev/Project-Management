import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, Badge, Button } from "../ui";
import KanbanBoard from "../kanban/KanbanBoard";
import TaskDetailModal from "../modals/TaskDetailModal";
import TaskExchangeModal from "../modals/TaskExchangeModal";
import { UserAnalytics } from "../analytics";
import { useTasks, useProjects, useTaskExchanges } from "../../hooks";
import { useTheme } from "../../context";

const UserDashboard = ({ user }) => {
  const { isDark } = useTheme();
  const [activeView, setActiveView] = useState("overview");
  const [taskDetailModal, setTaskDetailModal] = useState({
    isOpen: false,
    task: null,
  });
  const [exchangeModal, setExchangeModal] = useState({
    isOpen: false,
    task: null,
  });

  // Handle view change
  const handleViewChange = (newView) => {
    setActiveView(newView);
  };

  // Use real hooks instead of mock data
  const { projects, loading: projectsLoading } = useProjects();
  const currentProject = projects && projects.length > 0 ? projects[0] : null;
  const {
    tasks,
    loading: tasksLoading,
    fetchTasks,
    updateTaskStatus,
    deleteTask,
  } = useTasks(currentProject?.id);
  const {
    exchanges,
    loading: exchangesLoading,
    acceptExchange,
    rejectExchange,
    requestExchange,
  } = useTaskExchanges();

  // Show loading state if user is not available
  if (!user) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span
            className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Show loading state for data
  if (projectsLoading || tasksLoading || exchangesLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span
            className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading your tasks...
          </span>
        </div>
      </div>
    );
  }

  // Ensure arrays are initialized even if data is still loading
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeExchanges = Array.isArray(exchanges) ? exchanges : [];

  // Debug log to see what we're getting
  if (projects && !Array.isArray(projects)) {
    console.error("Projects is not an array:", projects);
  }

  // Show ALL project tasks to allow users to see and exchange with other team members' tasks
  // Users can only edit their own tasks, but can request exchanges on others' tasks
  const allProjectTasks = safeTasks;
  const myTasks = safeTasks.filter((task) => task.assigneeId === user.id);
  const pendingTasks = allProjectTasks.filter(
    (task) => task.status === "PENDING",
  );
  const doneTasks = allProjectTasks.filter((task) => task.status === "DONE");
  const completedTasks = allProjectTasks.filter(
    (task) => task.status === "COMPLETED",
  );

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      // Find the current task to check if status is actually changing
      const currentTask = myTasks?.find((task) => task.id === taskId);

      // If status is not changing, don't make API call or show any notification
      if (currentTask && currentTask.status === newStatus) {
        return; // Silent return for same-column moves
      }

      await updateTaskStatus(taskId, newStatus);

      // Special message for users moving tasks to DONE
      if (newStatus === "DONE") {
        toast.success(
          "Task moved to Done! Your manager will review and approve when complete.",
          {
            duration: 4000,
            icon: "✅",
          },
        );
      } else {
        toast.success(
          `Task moved to ${newStatus === "PENDING" ? "To Do" : newStatus === "IN_PROGRESS" ? "In Progress" : newStatus}`,
        );
      }
    } catch (error) {
      console.error("Failed to move task:", error);
      toast.error("Failed to move task");
    }
  };

  const handleTaskEdit = (task) => {
    console.log("Editing task:", task);
    toast("Task editing feature coming soon!");
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleTaskClick = (task) => {
    setTaskDetailModal({ isOpen: true, task });
  };

  const handleTaskDetailClose = () => {
    setTaskDetailModal({ isOpen: false, task: null });
  };

  const handleRequestExchange = (task) => {
    setExchangeModal({ isOpen: true, task });
  };

  const handleExchangeModalClose = () => {
    setExchangeModal({ isOpen: false, task: null });
  };

  const handleExchangeSubmit = async (exchangeData) => {
    try {
      await requestExchange(exchangeData);
      toast.success("Exchange request sent successfully!");
      setExchangeModal({ isOpen: false, task: null });
    } catch (error) {
      console.error("Failed to request exchange:", error);
      toast.error("Failed to send exchange request");
    }
  };

  const handleAddTask = (status) => {
    console.log("Adding task with status:", status);
    toast("Users cannot create tasks. Contact your manager.");
  };

  const handleAcceptExchange = async (exchangeId) => {
    try {
      await acceptExchange(exchangeId);
      toast.success("Exchange request accepted!");
      // Refresh tasks to show the reassigned task
      await fetchTasks();
    } catch (error) {
      console.error("Failed to accept exchange:", error);
      toast.error("Failed to accept exchange request");
    }
  };

  const handleRejectExchange = async (exchangeId) => {
    try {
      await rejectExchange(exchangeId);
      toast.success("Exchange request rejected");
    } catch (error) {
      console.error("Failed to reject exchange:", error);
      toast.error("Failed to reject exchange request");
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm border p-4 sm:p-6`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Welcome back, {user.username}! 👋
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="primary">USER</Badge>
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm sm:text-base`}
                >
                  Team Member
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Mobile: Dropdown Navigation */}
              <div className="block sm:hidden">
                <select
                  value={activeView}
                  onChange={(e) => handleViewChange(e.target.value)}
                  className={`w-full px-3 py-2 border ${isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="overview">📊 Overview Dashboard</option>
                  <option value="kanban">📋 Kanban Board</option>
                  <option value="analytics">📈 Analytics</option>
                </select>
              </div>

              {/* Desktop: Button Navigation */}
              <div className="hidden sm:flex gap-2">
                <Button
                  variant={activeView === "overview" ? "primary" : "outline"}
                  onClick={() => handleViewChange("overview")}
                  size="sm"
                  className={`transition-all duration-200 ${activeView === "overview" ? "shadow-lg scale-105" : ""}`}
                >
                  📊 Overview
                </Button>
                <Button
                  variant={activeView === "kanban" ? "primary" : "outline"}
                  onClick={() => handleViewChange("kanban")}
                  size="sm"
                  className={`transition-all duration-200 ${activeView === "kanban" ? "shadow-lg scale-105" : "hover:scale-105"}`}
                >
                  📋 Kanban
                </Button>
                <Button
                  variant={activeView === "analytics" ? "primary" : "outline"}
                  onClick={() => handleViewChange("analytics")}
                  size="sm"
                  className={`transition-all duration-200 ${activeView === "analytics" ? "shadow-lg scale-105" : "hover:scale-105"}`}
                >
                  � Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {activeView === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card padding="sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {myTasks.length}
                  </div>
                  <div
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    My Tasks
                  </div>
                </div>
              </Card>
              <Card padding="sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingTasks.length}
                  </div>
                  <div
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Team Pending
                  </div>
                </div>
              </Card>
              <Card padding="sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {doneTasks.length}
                  </div>
                  <div
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Team Review
                  </div>
                </div>
              </Card>
              <Card padding="sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedTasks.length}
                  </div>
                  <div
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Team Completed
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Task Table */}
            <Card className="overflow-hidden">
              <div
                className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  My Tasks
                </h3>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[800px]">
                  <thead className={`${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                    <tr>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider w-8`}
                      >
                        {/* Checkbox column */}
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[200px]`}
                      >
                        Task
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[120px]`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[100px]`}
                      >
                        Priority
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[120px]`}
                      >
                        Due Date
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[150px]`}
                      >
                        Project
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider min-w-[100px]`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`${isDark ? "bg-gray-900 divide-gray-700" : "bg-white divide-gray-200"} divide-y`}
                  >
                    {safeTasks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-12 text-center text-gray-400"
                        >
                          <div className="text-3xl mb-2">📋</div>
                          <p>No tasks assigned yet</p>
                        </td>
                      </tr>
                    ) : (
                      safeTasks.map((task) => {
                        const isOverdue =
                          task.dueDate &&
                          new Date(task.dueDate) < new Date() &&
                          task.status !== "COMPLETED";
                        const isMyTask = task.assigneeId === user.id;

                        return (
                          <tr
                            key={task.id}
                            className={`${isOverdue ? "bg-red-50" : ""}`}
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                onChange={() => {
                                  /* Handle checkbox */
                                }}
                              />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <button
                                    onClick={() => handleTaskClick(task)}
                                    className="text-left"
                                  >
                                    <div
                                      className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                      {task.title}
                                    </div>
                                    {task.description && (
                                      <div
                                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} line-clamp-1 mt-1`}
                                      >
                                        {task.description}
                                      </div>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  task.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "DONE"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.status === "PENDING"
                                  ? "To Do"
                                  : task.status === "DONE"
                                    ? "Working on it"
                                    : "Done"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  task.priority === "HIGH"
                                    ? "bg-purple-100 text-purple-800"
                                    : task.priority === "MEDIUM"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {task.dueDate ? (
                                <div
                                  className={`text-sm ${isOverdue ? "text-red-600 font-medium" : isDark ? "text-gray-300" : "text-gray-900"}`}
                                >
                                  {new Date(task.dueDate).toLocaleDateString()}
                                  {isOverdue && (
                                    <div className="text-xs text-red-500">
                                      Overdue
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  No due date
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div
                                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-900"}`}
                              >
                                {task.project?.name || "No Project"}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {isMyTask && (
                                  <button
                                    onClick={() => handleTaskClick(task)}
                                    className="text-blue-600 text-sm font-medium"
                                    title="View Details"
                                  >
                                    View
                                  </button>
                                )}
                                {!isMyTask && (
                                  <button
                                    onClick={() => handleRequestExchange(task)}
                                    className="text-green-600 text-sm font-medium"
                                    title="Request Exchange"
                                  >
                                    Exchange
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Task Exchange Requests - Smaller section */}
            <Card
              title="Task Exchange Requests"
              subtitle="Pending requests from teammates"
            >
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {safeExchanges.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-3xl mb-2">🔄</div>
                    <p className="text-sm">No pending exchange requests</p>
                  </div>
                ) : (
                  safeExchanges
                    .filter(
                      (exchange) =>
                        exchange.receiverId === user.id &&
                        exchange.status === "PENDING",
                    )
                    .map((exchange) => (
                      <div key={exchange.id} className="border rounded-lg p-3">
                        <div className="mb-2">
                          <h4 className="font-medium">
                            {exchange.task?.title || "Task Exchange"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Request from:{" "}
                            <span className="font-medium">
                              {exchange.requester?.username}
                            </span>
                          </p>
                          {exchange.requestNote && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              "{exchange.requestNote}"
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAcceptExchange(exchange.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleRejectExchange(exchange.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </Card>
          </>
        )}

        {activeView === "analytics" && (
          <>
            {/* Analytics Header */}
            <div
              className={`bg-gradient-to-r ${isDark ? "from-purple-900/20 to-indigo-900/20 border-purple-700/30" : "from-purple-50 to-indigo-50 border-purple-200"} border rounded-lg p-4 mb-6`}
            >
              <h2
                className={`text-xl font-bold ${isDark ? "text-purple-300" : "text-purple-900"} flex items-center gap-2`}
              >
                📈 Analytics Dashboard
                <span
                  className={`text-sm ${isDark ? "bg-purple-900/40 text-purple-200" : "bg-purple-100 text-purple-800"} px-2 py-1 rounded-full`}
                >
                  Active View
                </span>
              </h2>
              <p
                className={`${isDark ? "text-purple-400" : "text-purple-700"} text-sm mt-1`}
              >
                Track your productivity and performance metrics
              </p>
            </div>

            <UserAnalytics tasks={safeTasks} user={user} />
          </>
        )}

        {activeView === "kanban" && (
          <>
            {!currentProject ? (
              <Card
                title="No Project Assigned"
                subtitle="You haven't been assigned to any projects yet"
              >
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p>Contact your manager to be assigned to a project</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3
                    className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {currentProject.name}
                  </h3>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {currentProject.description}
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}
                  >
                    Showing all project tasks ({allProjectTasks.length} total,{" "}
                    {myTasks.length} assigned to you)
                  </p>
                </div>
                <div className="w-full">
                  <KanbanBoard
                    tasks={allProjectTasks || []}
                    userRole="USER"
                    currentUserId={user.id}
                    onTaskMove={handleTaskMove}
                    onTaskEdit={handleTaskEdit}
                    onTaskDelete={handleTaskDelete}
                    onTaskClick={handleTaskClick}
                    onAddTask={handleAddTask}
                    onRequestExchange={handleRequestExchange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailModal.isOpen}
        task={taskDetailModal.task}
        onClose={handleTaskDetailClose}
        canEdit={false}
        currentUserId={user.id}
      />

      {/* Task Exchange Modal */}
      <TaskExchangeModal
        isOpen={exchangeModal.isOpen}
        task={exchangeModal.task}
        onClose={handleExchangeModalClose}
        projectMembers={currentProject?.members || []}
        onSubmit={handleExchangeSubmit}
      />
    </div>
  );
};

export default UserDashboard;
