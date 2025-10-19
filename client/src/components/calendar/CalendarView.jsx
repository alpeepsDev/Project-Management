import React, { useState } from "react";
import { useTheme } from "../../context";
import { Card } from "../ui";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const CalendarView = ({ tasks, onTaskClick }) => {
  const { isDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get all days in the current month view
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    if (!tasks || !Array.isArray(tasks)) return [];

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get task color based on priority
  const getTaskColor = (task) => {
    if (task.status === "COMPLETED" || task.status === "DONE") {
      return "bg-green-500";
    }
    switch (task.priority) {
      case "URGENT":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "LOW":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div
        className={`border-b p-3 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon
              className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Calendar View
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span
              className={`text-sm font-medium min-w-[160px] text-center ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold py-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayObj, idx) => {
            const { date, isCurrentMonth } = dayObj;
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);

            return (
              <div
                key={idx}
                className={`min-h-[80px] p-1.5 rounded border transition-all cursor-pointer ${
                  isDark
                    ? today
                      ? "bg-blue-900/20 border-blue-500"
                      : isCurrentMonth
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-gray-900/50 border-gray-800"
                    : today
                      ? "bg-blue-50 border-blue-500"
                      : isCurrentMonth
                        ? "bg-white border-gray-200 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => {
                  // Future: Could open a modal or detail view for this date
                  console.log("Selected date:", date);
                }}
              >
                {/* Date Number */}
                <div
                  className={`text-xs font-medium mb-0.5 ${
                    today
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : isCurrentMonth
                        ? isDark
                          ? "text-gray-200"
                          : "text-gray-900"
                        : isDark
                          ? "text-gray-600"
                          : "text-gray-400"
                  }`}
                >
                  {date.getDate()}
                </div>

                {/* Tasks */}
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick && onTaskClick(task);
                      }}
                      className={`${getTaskColor(
                        task
                      )} text-white text-[10px] px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div
                      className={`text-[10px] px-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className={`border-t p-2 flex items-center gap-3 text-[10px] flex-wrap ${
          isDark
            ? "border-gray-700 bg-gray-800 text-gray-400"
            : "border-gray-200 bg-gray-50 text-gray-600"
        }`}
      >
        <span className="font-medium text-xs">Priority:</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-red-500"></div>
          <span>Urgent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-orange-500"></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-blue-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-purple-500"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-green-500"></div>
          <span>Completed</span>
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;
