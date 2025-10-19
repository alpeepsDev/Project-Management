import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { asyncHandler } from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

// Get all exchanges for current user (both sent and received)
export const getExchanges = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const exchanges = await prisma.taskExchange.findMany({
    where: {
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  res.json({
    success: true,
    data: exchanges,
  });
});

// Get all exchanges for manager's projects (manager-only endpoint)
export const getProjectExchanges = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Only managers can access this endpoint
  if (userRole !== "MANAGER") {
    return res.status(403).json({
      success: false,
      message: "Only managers can access project exchange logs",
    });
  }

  const exchanges = await prisma.taskExchange.findMany({
    where: {
      task: {
        project: {
          managerId: userId,
        },
      },
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  res.json({
    success: true,
    message: `Found ${exchanges.length} exchange records`,
    data: exchanges,
  });
});

// Get sent exchanges
export const getSentExchanges = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const exchanges = await prisma.taskExchange.findMany({
    where: { requesterId: userId },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  res.json({
    success: true,
    data: exchanges,
  });
});

// Get received exchanges
export const getReceivedExchanges = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const exchanges = await prisma.taskExchange.findMany({
    where: { receiverId: userId },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  res.json({
    success: true,
    data: exchanges,
  });
});

// Create new task exchange request
export const createExchange = asyncHandler(async (req, res) => {
  const { taskId, receiverId, requestNote } = req.body;
  const requesterId = req.user.id;

  // Validate required fields
  if (!taskId || !receiverId) {
    return res.status(400).json({
      success: false,
      message: "Task ID and receiver ID are required",
    });
  }

  // Prevent self-exchanges
  if (requesterId === receiverId) {
    return res.status(400).json({
      success: false,
      message: "Cannot create exchange request with yourself",
    });
  }

  // Check if task exists and user has access
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check if requester has access to the task (either assigned to them or they're the creator)
  if (task.assigneeId !== requesterId && task.createdById !== requesterId) {
    return res.status(403).json({
      success: false,
      message:
        "You can only create exchange requests for tasks assigned to you or created by you",
    });
  }

  // Check if receiver exists and is a member of the project
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const isReceiverInProject =
    task.project.managerId === receiverId ||
    task.project.members.some((member) => member.userId === receiverId);

  if (!isReceiverInProject) {
    return res.status(400).json({
      success: false,
      message: "Receiver must be a member of the project",
    });
  }

  // Check if there's already a pending exchange for this task
  const existingExchange = await prisma.taskExchange.findFirst({
    where: {
      taskId,
      status: "PENDING",
    },
  });

  if (existingExchange) {
    return res.status(400).json({
      success: false,
      message: "There is already a pending exchange request for this task",
    });
  }

  const exchange = await prisma.taskExchange.create({
    data: {
      taskId,
      requesterId,
      receiverId,
      requestNote: requestNote || "",
      status: "PENDING",
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Exchange request created successfully",
    data: exchange,
  });
});

// Respond to exchange request (accept/reject)
export const respondToExchange = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, responseNote } = req.body;
  const userId = req.user.id;

  // Validate status
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be either ACCEPTED or REJECTED",
    });
  }

  const exchange = await prisma.taskExchange.findUnique({
    where: { id },
    include: {
      task: true,
    },
  });

  if (!exchange) {
    return res.status(404).json({
      success: false,
      message: "Exchange request not found",
    });
  }

  // Only the receiver can respond to the exchange
  if (exchange.receiverId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Only the receiver can respond to this exchange request",
    });
  }

  // Can only respond to pending exchanges
  if (exchange.status !== "PENDING") {
    return res.status(400).json({
      success: false,
      message: "Exchange request has already been responded to",
    });
  }

  // Start transaction for accepting exchange (need to update both exchange and task)
  const result = await prisma.$transaction(async (tx) => {
    // Update exchange status
    const updatedExchange = await tx.taskExchange.update({
      where: { id },
      data: {
        status,
        responseNote: responseNote || "",
        respondedAt: new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If accepted, transfer task ownership
    if (status === "ACCEPTED") {
      await tx.task.update({
        where: { id: exchange.taskId },
        data: {
          assigneeId: exchange.receiverId,
        },
      });
    }

    return updatedExchange;
  });

  const action = status === "ACCEPTED" ? "accepted" : "rejected";
  const message =
    status === "ACCEPTED"
      ? "Exchange request accepted and task transferred successfully"
      : "Exchange request rejected";

  res.json({
    success: true,
    message,
    data: result,
  });
});

// Accept exchange request
export const acceptExchange = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { responseNote } = req.body;
  const userId = req.user.id;

  const exchange = await prisma.taskExchange.findUnique({
    where: { id },
    include: {
      task: true,
    },
  });

  if (!exchange) {
    return res.status(404).json({
      success: false,
      message: "Exchange request not found",
    });
  }

  // Only the receiver can accept the exchange
  if (exchange.receiverId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Only the receiver can accept this exchange request",
    });
  }

  // Can only accept pending exchanges
  if (exchange.status !== "PENDING") {
    return res.status(400).json({
      success: false,
      message: "Exchange request has already been responded to",
    });
  }

  // Start transaction for accepting exchange (need to update both exchange and task)
  const result = await prisma.$transaction(async (tx) => {
    // Update exchange status
    const updatedExchange = await tx.taskExchange.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        responseNote: responseNote || "",
        respondedAt: new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transfer task ownership
    await tx.task.update({
      where: { id: exchange.taskId },
      data: {
        assigneeId: exchange.receiverId,
      },
    });

    return updatedExchange;
  });

  res.json({
    success: true,
    message: "Exchange request accepted and task transferred successfully",
    data: result,
  });
});

// Reject exchange request
export const rejectExchange = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { responseNote } = req.body;
  const userId = req.user.id;

  const exchange = await prisma.taskExchange.findUnique({
    where: { id },
    include: {
      task: true,
    },
  });

  if (!exchange) {
    return res.status(404).json({
      success: false,
      message: "Exchange request not found",
    });
  }

  // Only the receiver can reject the exchange
  if (exchange.receiverId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Only the receiver can reject this exchange request",
    });
  }

  // Can only reject pending exchanges
  if (exchange.status !== "PENDING") {
    return res.status(400).json({
      success: false,
      message: "Exchange request has already been responded to",
    });
  }

  // Update exchange status
  const updatedExchange = await prisma.taskExchange.update({
    where: { id },
    data: {
      status: "REJECTED",
      responseNote: responseNote || "",
      respondedAt: new Date(),
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json({
    success: true,
    message: "Exchange request rejected",
    data: updatedExchange,
  });
});

// Cancel exchange request
export const cancelExchange = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const exchange = await prisma.taskExchange.findUnique({
    where: { id },
  });

  if (!exchange) {
    return res.status(404).json({
      success: false,
      message: "Exchange request not found",
    });
  }

  // Only the requester can cancel the exchange
  if (exchange.requesterId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Only the requester can cancel this exchange request",
    });
  }

  // Can only cancel pending exchanges
  if (exchange.status !== "PENDING") {
    return res.status(400).json({
      success: false,
      message:
        "Cannot cancel exchange request that has already been responded to",
    });
  }

  const updatedExchange = await prisma.taskExchange.update({
    where: { id },
    data: {
      status: "CANCELLED",
      respondedAt: new Date(),
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json({
    success: true,
    message: "Exchange request cancelled successfully",
    data: updatedExchange,
  });
});
