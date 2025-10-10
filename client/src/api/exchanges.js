import api from "./index.js";

// Mock data for development
const MOCK_EXCHANGES = [
  {
    id: "ex1",
    fromUserId: "u1",
    toUserId: "m1",
    taskId: "task1",
    message: "Can we extend the deadline for this task?",
    status: "PENDING",
    createdAt: "2025-09-23T10:00:00.000Z",
  },
];

// Check if we should use mock data
const USE_MOCK_DATA = false;

export const exchangesApi = {
  // Create task exchange
  createExchange: async (exchangeData) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newExchange = {
        id: `ex${Date.now()}`,
        ...exchangeData,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      MOCK_EXCHANGES.push(newExchange);
      return {
        success: true,
        data: newExchange,
      };
    }
    const response = await api.post("/exchanges", exchangeData);
    return response.data;
  },

  // Get user's exchange requests (sent and received)
  getUserExchanges: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: MOCK_EXCHANGES,
      };
    }
    const response = await api.get("/exchanges");
    return response.data;
  },

  // Get all exchanges for manager's projects (manager-only)
  getProjectExchanges: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: MOCK_EXCHANGES,
      };
    }
    const response = await api.get("/exchanges/project");
    return response.data;
  },

  // Get exchanges for a specific task
  getTaskExchanges: async (taskId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const taskExchanges = MOCK_EXCHANGES.filter((ex) => ex.taskId === taskId);
      return {
        success: true,
        data: taskExchanges,
      };
    }
    const response = await api.get(`/exchanges/task/${taskId}`);
    return response.data;
  },

  // Accept exchange request
  acceptExchange: async (exchangeId, responseNote = "") => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const exchange = MOCK_EXCHANGES.find((ex) => ex.id === exchangeId);
      if (exchange) {
        exchange.status = "ACCEPTED";
        exchange.responseNote = responseNote;
        exchange.respondedAt = new Date().toISOString();
      }
      return {
        success: true,
        data: exchange,
      };
    }
    const response = await api.put(`/exchanges/${exchangeId}/accept`, {
      responseNote,
    });
    return response.data;
  },

  // Reject exchange request
  rejectExchange: async (exchangeId, responseNote = "") => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const exchange = MOCK_EXCHANGES.find((ex) => ex.id === exchangeId);
      if (exchange) {
        exchange.status = "REJECTED";
        exchange.responseNote = responseNote;
        exchange.respondedAt = new Date().toISOString();
      }
      return {
        success: true,
        data: exchange,
      };
    }
    const response = await api.put(`/exchanges/${exchangeId}/reject`, {
      responseNote,
    });
    return response.data;
  },

  // Cancel exchange request (by requester)
  cancelExchange: async (exchangeId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const exchange = MOCK_EXCHANGES.find((ex) => ex.id === exchangeId);
      if (exchange) {
        exchange.status = "CANCELLED";
        exchange.cancelledAt = new Date().toISOString();
      }
      return {
        success: true,
        data: exchange,
      };
    }
    const response = await api.put(`/exchanges/${exchangeId}/cancel`);
    return response.data;
  },

  // Get single exchange details
  getExchange: async (exchangeId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const exchange = MOCK_EXCHANGES.find((ex) => ex.id === exchangeId);
      return {
        success: true,
        data: exchange,
      };
    }
    const response = await api.get(`/exchanges/${exchangeId}`);
    return response.data;
  },
};
