import api from "./index.js";

// Mock tasks data
const MOCK_TASKS = [
  {
    id: "task1",
    title: "Design Authentication System",
    description: "Create a secure authentication system with JWT tokens",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2025-09-30",
    assigneeId: "u1",
    projectId: "proj1",
    createdAt: "2025-09-15T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task2",
    title: "Implement Task Board",
    description: "Create a drag-and-drop Kanban board for task management",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2025-10-15",
    assigneeId: "u1",
    projectId: "proj1",
    createdAt: "2025-09-16T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task3",
    title: "Setup Database Schema",
    description: "Design and implement the database schema for tasks and users",
    status: "DONE",
    priority: "HIGH",
    dueDate: "2025-09-20",
    assigneeId: "u1",
    projectId: "proj1",
    createdAt: "2025-09-10T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task4",
    title: "API Endpoint Development",
    description: "Create RESTful API endpoints for task management",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-10-05",
    assigneeId: "u2",
    projectId: "proj1",
    createdAt: "2025-09-18T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task5",
    title: "User Interface Polish",
    description: "Improve the user interface and user experience",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2025-10-20",
    assigneeId: "u3",
    projectId: "proj2",
    createdAt: "2025-09-19T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task6",
    title: "Bug Fixes and Testing",
    description: "Fix critical bugs and perform comprehensive testing",
    status: "DONE",
    priority: "HIGH",
    dueDate: "2025-09-25",
    assigneeId: "u2",
    projectId: "proj2",
    createdAt: "2025-09-12T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task7",
    title: "Documentation Update",
    description: "Update project documentation and user guides",
    status: "COMPLETED",
    priority: "LOW",
    dueDate: "2025-09-15",
    assigneeId: "u1",
    projectId: "proj1",
    createdAt: "2025-09-08T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task8",
    title: "Performance Optimization",
    description: "Optimize application performance and load times",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2025-09-10", // This will be overdue
    assigneeId: "u3",
    projectId: "proj3",
    createdAt: "2025-09-05T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task9",
    title: "Security Audit",
    description: "Conduct comprehensive security audit and fixes",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-10-30",
    assigneeId: "u2",
    projectId: "proj3",
    createdAt: "2025-09-20T00:00:00.000Z",
    createdById: "m1",
  },
  {
    id: "task10",
    title: "Mobile Responsiveness",
    description: "Ensure application works well on mobile devices",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2025-10-01",
    assigneeId: "u1",
    projectId: "proj2",
    createdAt: "2025-09-17T00:00:00.000Z",
    createdById: "m1",
  },
];

// Check if we should use mock data
const USE_MOCK_DATA = false;

export const tasksApi = {
  // Get all tasks for a project
  getProjectTasks: async (projectId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const projectTasks = MOCK_TASKS.filter(
        (task) => task.projectId === projectId
      );
      return {
        success: true,
        data: projectTasks,
      };
    }
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  // Get single task
  getTask: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const task = MOCK_TASKS.find((t) => t.id === taskId);
      return {
        success: true,
        data: task,
      };
    }
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newTask = {
        id: `task${Date.now()}`,
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      MOCK_TASKS.push(newTask);
      return {
        success: true,
        data: newTask,
      };
    }
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, updates) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskIndex = MOCK_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        MOCK_TASKS[taskIndex] = { ...MOCK_TASKS[taskIndex], ...updates };
        return {
          success: true,
          data: MOCK_TASKS[taskIndex],
        };
      }
      throw new Error("Task not found");
    }
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // Move task (for Kanban board)
  moveTask: async (taskId, { status, position }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskIndex = MOCK_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        MOCK_TASKS[taskIndex].status = status;
        return {
          success: true,
          data: MOCK_TASKS[taskIndex],
        };
      }
      throw new Error("Task not found");
    }

    try {
      console.log("Moving task:", { taskId, status, position });
      const response = await api.put(`/tasks/${taskId}/move`, {
        status,
        position,
      });
      console.log("Move task response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Move task error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        taskId,
        newStatus: status,
        position,
      });
      throw error;
    }
  },

  // Assign task to user
  assignTask: async (taskId, assigneeId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskIndex = MOCK_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        MOCK_TASKS[taskIndex].assignedTo = assigneeId;
        return {
          success: true,
          data: MOCK_TASKS[taskIndex],
        };
      }
      throw new Error("Task not found");
    }
    const response = await api.put(`/tasks/${taskId}/assign`, { assigneeId });
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskIndex = MOCK_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const deletedTask = MOCK_TASKS.splice(taskIndex, 1)[0];
        return {
          success: true,
          data: deletedTask,
        };
      }
      throw new Error("Task not found");
    }
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Get task comments
  getTaskComments: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Mock comments for demonstration
      const mockComments = [
        {
          id: "comment1",
          taskId,
          content: "Great progress on this task!",
          authorId: "m1",
          authorName: "Test Manager",
          createdAt: "2025-09-23T09:00:00.000Z",
        },
        {
          id: "comment2",
          taskId,
          content: "I have some questions about the implementation approach.",
          authorId: "u1",
          authorName: "Test User",
          createdAt: "2025-09-23T10:30:00.000Z",
        },
      ];
      return {
        success: true,
        data: mockComments,
      };
    }
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // Add task comment
  addTaskComment: async (taskId, content) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newComment = {
        id: `comment${Date.now()}`,
        taskId,
        content,
        authorId: "u1", // In real app, this would come from auth context
        authorName: "Test User",
        createdAt: new Date().toISOString(),
      };
      return {
        success: true,
        data: newComment,
      };
    }
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  // Get task comments
  getComments: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Mock comments data
      const mockComments = [
        {
          id: "comment1",
          taskId,
          content: "This looks good! Just a few minor adjustments needed.",
          author: { username: "manager_user" },
          createdAt: "2025-09-20T10:30:00.000Z",
        },
        {
          id: "comment2",
          taskId,
          content: "I've updated the design based on your feedback.",
          author: { username: "team_member" },
          createdAt: "2025-09-20T14:15:00.000Z",
        },
      ];
      return {
        success: true,
        data: mockComments,
      };
    }
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // Add comment (alias for addTaskComment)
  addComment: async (taskId, commentData) => {
    return tasksApi.addTaskComment(taskId, commentData.content);
  },

  // Manager-specific endpoints
  getTasksAwaitingApproval: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: [], // No tasks awaiting approval in mock mode
      };
    }
    const response = await api.get("/tasks/manager/awaiting-approval");
    return response.data;
  },

  getManagerStats: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Calculate stats from mock data
      const totalTasks = MOCK_TASKS.length;
      const tasksAwaitingApproval = MOCK_TASKS.filter(
        (t) => t.status === "DONE"
      ).length;
      const overdueTasks = MOCK_TASKS.filter((t) => {
        const dueDate = new Date(t.dueDate);
        const now = new Date();
        return dueDate < now && t.status !== "COMPLETED" && t.status !== "DONE";
      }).length;

      // For projects and team members, we need to import or define mock data
      // For now, using reasonable mock values
      const projectCount = 3; // Assuming multiple projects
      const totalTeamMembers = 8; // Based on the team size in MOCK_PROJECTS

      return {
        success: true,
        data: {
          projectCount,
          totalTasks,
          tasksAwaitingApproval,
          overdueTasks,
          totalTeamMembers,
        },
      };
    }
    const response = await api.get("/tasks/manager/stats");
    return response.data;
  },

  getManagerTasks: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: MOCK_TASKS,
      };
    }
    const response = await api.get("/tasks/manager/all-tasks");
    return response.data;
  },

  approveTask: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskIndex = MOCK_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        MOCK_TASKS[taskIndex].approved = true;
        return {
          success: true,
          data: MOCK_TASKS[taskIndex],
        };
      }
      throw new Error("Task not found");
    }
    const response = await api.put(`/tasks/${taskId}/approve`);
    return response.data;
  },
};
