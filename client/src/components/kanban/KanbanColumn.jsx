import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTheme } from "../../context";
import TaskCard from "./TaskCard";

const KanbanColumn = ({
  id,
  title,
  icon,
  color,
  accentColor,
  tasks,
  userRole,
  currentUserId,
  onTaskEdit,
  onTaskDelete,
  onTaskClick,
  onAddTask,
  onRequestExchange,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { isDark } = useTheme();

  const getColumnStyles = () => {
    const baseStyles = `kanban-column ${color} rounded-lg p-4 sm:p-5 h-[600px] w-full border border-gray-300 ${isDark ? "border-gray-600" : "border-gray-300"} transition-all duration-200 flex flex-col`;
    return isOver ? `${baseStyles} drop-zone-active` : baseStyles;
  };

  const getTaskCount = () => tasks.length;

  const canAddTask = () => {
    // Only managers can add tasks, users can only work on assigned tasks
    return userRole === "MANAGER";
  };

  return (
    <div className={getColumnStyles()}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h3
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"} text-base sm:text-lg`}
            >
              {title}
            </h3>
            <span
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"} font-medium`}
            >
              {getTaskCount()} {getTaskCount() === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>
        {/* Add Task Button */}
        {canAddTask() && (
          <button
            onClick={() => onAddTask(id)}
            className={`p-2 rounded-lg ${
              isDark
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            title="Add new task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Task List */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
        disabled={false}
      >
        <div
          ref={setNodeRef}
          className={`kanban-task-list sortable-context space-y-3 sm:space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent 
            ${isOver ? `ring-2 ring-blue-400 ${isDark ? "ring-blue-300" : "ring-blue-500"} bg-opacity-10 ${isDark ? "bg-blue-900" : "bg-blue-50"}` : ""} 
            transition-all duration-200 rounded-lg`}
          data-over={isOver}
          data-column-id={id}
          style={{
            maxHeight: "calc(100% - 80px)", // Use remaining space after header
            overflowX: "hidden",
            scrollbarWidth: "thin",
            paddingRight: "8px", // More space for custom scrollbar
            paddingLeft: "4px",
            paddingTop: "8px",
            paddingBottom: "16px", // Extra padding for better drop detection
            minHeight: "200px", // Larger minimum height for easier dropping
          }}
        >
          {tasks.length === 0 ? (
            <div
              className={`text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm font-medium">No tasks in this column</p>
              {canAddTask() && (
                <p className="text-xs mt-2 opacity-75">Click + to add a task</p>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{ ...task, currentUserId }}
                userRole={userRole}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onTaskClick={onTaskClick}
                onRequestExchange={onRequestExchange}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
