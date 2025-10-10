import api from "./index.js";

// Mock data for development
const MOCK_PROJECTS = [
  {
    id: "proj1",
    name: "TaskForge Development",
    description: "Building the ultimate task management system",
    status: "ACTIVE",
    createdBy: "m1",
    createdAt: "2025-09-01T00:00:00.000Z",
    tasks: [
      {
        id: "task1",
        title: "Design Authentication System",
        description: "Create a secure authentication system with JWT tokens",
        status: "TODO",
        priority: "HIGH",
        dueDate: "2025-09-30",
        assignedTo: "u1",
        projectId: "proj1",
        createdAt: "2025-09-15T00:00:00.000Z",
      },
      {
        id: "task2",
        title: "Implement Task Board",
        description: "Create a drag-and-drop Kanban board for task management",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: "2025-10-15",
        assignedTo: "u1",
        projectId: "proj1",
        createdAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "task3",
        title: "Setup Database Schema",
        description:
          "Design and implement the database schema for tasks and users",
        status: "DONE",
        priority: "HIGH",
        dueDate: "2025-09-20",
        assignedTo: "u1",
        projectId: "proj1",
        createdAt: "2025-09-10T00:00:00.000Z",
      },
    ],
    members: [
      {
        id: "m1",
        username: "testmanager",
        name: "Test Manager",
        role: "MANAGER",
        email: "manager2@example.com",
      },
      {
        id: "u1",
        username: "testuser",
        name: "Test User",
        role: "USER",
        email: "user1@example.com",
      },
      {
        id: "u2",
        username: "testuser2",
        name: "Test User 2",
        role: "USER",
        email: "user2@example.com",
      },
    ],
  },
];

// Check if we should use mock data
const USE_MOCK_DATA = false;

export const projectsApi = {
  // Get user's projects
  getUserProjects: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: MOCK_PROJECTS,
      };
    }
    const response = await api.get("/projects");
    return response.data;
  },

  // Get single project with tasks
  getProject: async (projectId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const project = MOCK_PROJECTS.find((p) => p.id === projectId);
      return {
        success: true,
        data: project,
      };
    }
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newProject = {
        id: `proj${Date.now()}`,
        ...projectData,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        tasks: [],
      };
      MOCK_PROJECTS.push(newProject);
      return {
        success: true,
        data: newProject,
      };
    }
    const response = await api.post("/projects", projectData);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, updates) => {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Add member to project
  addMember: async (projectId, userId, role = "USER") => {
    const response = await api.post(`/projects/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    const response = await api.delete(
      `/projects/${projectId}/members/${userId}`
    );
    return response.data;
  },

  // Update member role
  updateMemberRole: async (projectId, userId, role) => {
    const response = await api.put(`/projects/${projectId}/members/${userId}`, {
      role,
    });
    return response.data;
  },

  // Get all users (for adding members)
  getAllUsers: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Mock users data
      const mockUsers = [
        {
          id: "u1",
          username: "testuser",
          name: "Test User",
          role: "USER",
          email: "user1@example.com",
        },
        {
          id: "u2",
          username: "testuser2",
          name: "Test User 2",
          role: "USER",
          email: "user2@example.com",
        },
        {
          id: "u3",
          username: "testuser3",
          name: "Test User 3",
          role: "USER",
          email: "user3@example.com",
        },
        {
          id: "m1",
          username: "testmanager",
          name: "Test Manager",
          role: "MANAGER",
          email: "manager@example.com",
        },
        {
          id: "a1",
          username: "testadmin",
          name: "Test Admin",
          role: "ADMIN",
          email: "admin@example.com",
        },
      ];
      return {
        success: true,
        data: mockUsers,
      };
    }
    const response = await api.get("/users");
    return response.data;
  },
};
