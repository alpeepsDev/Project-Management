import React, { useState, useEffect, useCallback } from "react";
import { Button, Badge } from "../ui";
import { toast } from "react-hot-toast";
import { tasksApi } from "../../api/tasks";
import { useTheme } from "../../context";

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

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

  // Load comments when task changes
  const loadComments = useCallback(async () => {
    if (!task?.id) return;

    try {
      setCommentsLoading(true);
      const response = await tasksApi.getComments(task.id);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, [task?.id]);

  useEffect(() => {
    if (task?.id) {
      loadComments();
    }
  }, [task?.id, loadComments]);

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await tasksApi.addComment(task.id, {
        content: newComment.trim(),
      });

      if (response.data) {
        setComments((prev) => [...prev, response.data]);
        setNewComment("");
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key for comment submission
  const handleCommentKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "LOW":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "DONE":
        return "warning";
      case "IN_PROGRESS":
        return "primary";
      case "PENDING":
        return "default";
      default:
        return "default";
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/30"
        onClick={onClose}
      />

      {/* Modal with Glassmorphism Effect - Fixed height with no scroll */}
      <div
        className={`relative ${
          isDark
            ? "bg-gray-900/90 border-gray-700/50"
            : "bg-white/90 border-gray-200/50"
        } backdrop-blur-xl border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="p-6 flex-shrink-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2
                className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
              >
                {task.title}
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"} transition-colors`}
            >
              <svg
                className="w-6 h-6"
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

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
              >
                Task Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Assigned to:
                  </span>
                  <span
                    className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {task.assignee?.username || "Unassigned"}
                  </span>
                </div>
                <div>
                  <span
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Project:
                  </span>
                  <span
                    className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {task.project?.name || "Unknown Project"}
                  </span>
                </div>
                <div>
                  <span
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Created by:
                  </span>
                  <span
                    className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {task.createdBy?.username || "Unknown"}
                  </span>
                </div>
                <div>
                  <span
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Due date:
                  </span>
                  <span
                    className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
              >
                Description
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed`}
              >
                {task.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2 border-t border-gray-200/50 flex-shrink-0">
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}
            >
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex gap-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleCommentKeyPress}
                  placeholder="Add a comment... (Press Enter to submit, Shift+Enter for new line)"
                  rows={2}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    isDark
                      ? "border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  }`}
                  style={{ userSelect: "text", WebkitUserSelect: "text" }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !newComment.trim()}
                  size="sm"
                >
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </div>

          {/* Comments List - Only this section scrolls */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <p
                className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"} py-4`}
              >
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700/50"
                        : "bg-gray-50/50 border-gray-200/50"
                    } border`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-medium text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}
                      >
                        {comment.author?.username ||
                          comment.author ||
                          "Anonymous"}
                      </span>
                      <span
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : comment.timestamp}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap`}
                    >
                      {comment.content || comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
