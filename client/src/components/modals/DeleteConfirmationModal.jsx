import React, { useEffect } from "react";
import { Button } from "../ui";
import { useTheme } from "../../context";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  loading = false,
  dangerText = "This action cannot be undone.",
}) => {
  const { isDark } = useTheme();

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
        } backdrop-blur-xl border rounded-lg shadow-2xl w-full max-w-md`}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.182 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2
                className={`ml-3 text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"} transition-colors`}
              disabled={loading}
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

          {/* Content */}
          <div className="mb-6">
            <p
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} mb-4`}
            >
              {message}
            </p>
            {itemName && (
              <div
                className={`${isDark ? "bg-gray-800/50" : "bg-gray-50"} rounded-md p-3 mb-3`}
              >
                <p
                  className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                >
                  Project:{" "}
                  <span className="font-bold text-red-600">{itemName}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 font-medium">⚠️ {dangerText}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={loading}
              className="flex-1 w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              loading={loading}
              className="flex-1 w-full sm:w-auto order-1 sm:order-2"
            >
              {loading ? "Deleting..." : "Delete Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
