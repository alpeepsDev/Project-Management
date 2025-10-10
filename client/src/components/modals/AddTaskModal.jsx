import React, { useState, useEffect } from "react";
import { Button } from "../ui";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context";

const AddTaskModal = ({
  isOpen,
  onClose,
  onSave,
  selectedProject,
  projects = [],
  users = [],
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: selectedProject?.id || "",
    assigneeId: "",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!formData.projectId) {
      toast.error("Please select a project");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate || null,
      };
      await onSave(taskData);
      toast.success("Task created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        projectId: selectedProject?.id || "",
        assigneeId: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get users for the selected project, sorted by task count (least busy first)
  const getProjectUsers = () => {
    if (!formData.projectId) return [];

    const project = projects.find((p) => p.id === formData.projectId);
    if (!project) return [];

    console.log("🔍 Selected project:", project);
    console.log("🔍 Project members:", project.members);

    // Get project members only
    const members = project.members || [];
    let projectUsers = [];

    // Handle different data structures - check if members exist and have users
    if (members.length > 0 && members[0].user) {
      projectUsers = members.map((member) => ({
        ...member,
        taskCount: member.user._count?.assignedTasks || 0,
      }));
    } else if (members.length > 0 && members[0].username) {
      // If members is an array of user objects directly
      projectUsers = members.map((user) => ({
        userId: user.id,
        user,
        taskCount: user._count?.assignedTasks || 0,
      }));
    } else {
      // Fallback: filter all users to only those who are members of this project
      const memberIds = members.map((m) => m.userId || m.id);
      projectUsers = users
        .filter((user) => memberIds.includes(user.id))
        .map((user) => ({
          userId: user.id,
          user,
          taskCount: user._count?.assignedTasks || 0,
        }));
    }

    console.log("🔍 Processed project users:", projectUsers);

    // Sort by task count (least busy first), then by name
    return projectUsers.sort((a, b) => {
      const aTaskCount = a.taskCount || 0;
      const bTaskCount = b.taskCount || 0;

      if (aTaskCount !== bTaskCount) {
        return aTaskCount - bTaskCount; // Ascending (least tasks first)
      }

      // If same task count, sort by name
      const aName = (a.user?.name || a.user?.username || "").toLowerCase();
      const bName = (b.user?.name || b.user?.username || "").toLowerCase();
      return aName.localeCompare(bName);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/30"
        onClick={onClose}
      />

      {/* Modal with Glassmorphism Effect */}
      <div
        className={`relative ${
          isDark
            ? "bg-gray-900/80 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl border rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"} transition-colors p-1`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Selection */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Project *
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter task description"
              />
            </div>

            {/* Assignee */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Assignee (Project Members Only)
              </label>
              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Unassigned</option>
                {getProjectUsers().map((member) => {
                  const user = member.user || member;
                  const userId = member.userId || member.id;
                  const displayName =
                    user.name || user.username || "Unknown User";
                  const username = user.username || "";
                  const taskCount = member.taskCount || 0;

                  return (
                    <option key={userId} value={userId}>
                      {username ? `${username} - ${displayName}` : displayName}{" "}
                      ({taskCount} tasks)
                    </option>
                  );
                })}
              </select>
              {formData.projectId && getProjectUsers().length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No team members found in selected project
                </p>
              )}
              {getProjectUsers().length > 0 && (
                <p
                  className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
                >
                  {getProjectUsers().length} project member(s) available (sorted
                  by workload)
                </p>
              )}
              {/* Debug info - remove in production */}
              {import.meta.env.DEV && (
                <div
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mt-1 space-y-1`}
                >
                  <div>
                    Debug: {getProjectUsers().length} project members found
                  </div>
                  <div>Selected Project ID: {formData.projectId || "None"}</div>
                  <div>Projects available: {projects.length}</div>
                  {formData.projectId && (
                    <div
                      className={`max-h-20 overflow-y-auto ${isDark ? "bg-gray-700" : "bg-gray-50"} p-2 rounded text-xs`}
                    >
                      <div>
                        Project data:{" "}
                        {JSON.stringify(
                          projects.find((p) => p.id === formData.projectId)
                            ?.members,
                          null,
                          2
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1 w-full sm:w-auto"
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
