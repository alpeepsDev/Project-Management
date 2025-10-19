import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card } from "../ui";
import { useTheme } from "../../context";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  memberIds: z.array(z.string()).optional(),
});

const CreateProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  onSave,
  loading,
  users = [],
}) => {
  const { isDark } = useTheme();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      memberIds: [],
    },
  });

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

  const handleFormSubmit = async (data) => {
    try {
      // Prefer onSubmit if provided, otherwise fall back to onSave prop name
      const submitHandler =
        typeof onSubmit === "function"
          ? onSubmit
          : typeof onSave === "function"
            ? onSave
            : null;
      if (!submitHandler) {
        console.warn(
          "CreateProjectModal: No submit handler provided (onSubmit/onSave). Skipping."
        );
        return;
      }

      // Include selected members in the data
      const projectData = {
        ...data,
        memberIds: selectedMembers,
      };

      await submitHandler(projectData);
      reset();
      setSelectedMembers([]);
      onClose();
    } catch (error) {
      console.error("Project creation failed:", error);
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) => {
      const newMembers = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      setValue("memberIds", newMembers);
      return newMembers;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          isDark
            ? "bg-gray-900/80 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        } backdrop-blur-xl border rounded-lg shadow-2xl max-w-md w-full`}
      >
        <Card className="border-0 bg-transparent">
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Create New Project
            </h3>
            <button
              onClick={onClose}
              className={`${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"} transition-colors`}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
              {...register("name")}
              label="Project Name"
              placeholder="Enter project name"
              error={errors.name?.message}
            />

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Project description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Member Selection */}
            {users && users.length > 0 && (
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Assign Members (Optional)
                </label>
                <div
                  className={`max-h-40 overflow-y-auto border rounded-md p-3 space-y-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-600"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={() => handleMemberToggle(user.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {user.name || user.username}{" "}
                        {user.email && `(${user.email})`}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <p
                    className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {selectedMembers.length} member
                    {selectedMembers.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={loading}>
                Create Project
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateProjectModal;
