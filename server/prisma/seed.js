// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Hash password once for all users
  const hashedPassword = await bcrypt.hash("password123", 12);
  console.log("🔐 Creating users with encrypted passwords...");

  const users = [
    {
      username: "john_doe",
      email: "user1@example.com",
      password: hashedPassword,
      name: "John Doe",
      role: "USER",
    },
    {
      username: "jane_smith",
      email: "user2@example.com",
      password: hashedPassword,
      name: "Jane Smith",
      role: "USER",
    },
    {
      username: "demo_user",
      email: "user3@example.com",
      password: hashedPassword,
      name: "Demo User",
      role: "USER",
    },
    {
      username: "alex_brown",
      email: "user4@example.com",
      password: hashedPassword,
      name: "Alex Brown",
      role: "USER",
    },
    {
      username: "emma_davis",
      email: "user5@example.com",
      password: hashedPassword,
      name: "Emma Davis",
      role: "USER",
    },
    {
      username: "david_wilson",
      email: "user6@example.com",
      password: hashedPassword,
      name: "David Wilson",
      role: "USER",
    },
    {
      username: "lisa_garcia",
      email: "user7@example.com",
      password: hashedPassword,
      name: "Lisa Garcia",
      role: "USER",
    },
    {
      username: "ryan_miller",
      email: "user8@example.com",
      password: hashedPassword,
      name: "Ryan Miller",
      role: "USER",
    },
    {
      username: "sofia_martinez",
      email: "user9@example.com",
      password: hashedPassword,
      name: "Sofia Martinez",
      role: "USER",
    },
    {
      username: "james_taylor",
      email: "user10@example.com",
      password: hashedPassword,
      name: "James Taylor",
      role: "USER",
    },
    {
      username: "olivia_anderson",
      email: "user11@example.com",
      password: hashedPassword,
      name: "Olivia Anderson",
      role: "USER",
    },
    {
      username: "noah_thomas",
      email: "user12@example.com",
      password: hashedPassword,
      name: "Noah Thomas",
      role: "USER",
    },
    {
      username: "ava_jackson",
      email: "user13@example.com",
      password: hashedPassword,
      name: "Ava Jackson",
      role: "USER",
    },
    {
      username: "liam_white",
      email: "user14@example.com",
      password: hashedPassword,
      name: "Liam White",
      role: "USER",
    },
    {
      username: "mia_harris",
      email: "user15@example.com",
      password: hashedPassword,
      name: "Mia Harris",
      role: "USER",
    },
  ];

  let createdUsers = [];

  for (const userData of users) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: userData.username }, { email: userData.email }],
        },
      });

      if (existingUser) {
        console.log(
          `⚠️  User ${userData.username} already exists, skipping...`,
        );
        createdUsers.push(existingUser);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: userData,
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      createdUsers.push(user);
      console.log(
        `✅ Created ${user.role} user: ${user.username} (${user.name})`,
      );
    } catch (error) {
      console.error(
        `❌ Error creating user ${userData.username}:`,
        error.message,
      );
    }
  }

  // Create sample projects
  console.log("🏗️  Creating sample projects...");
  const userMembers = createdUsers.filter((u) => u.role === "USER");

  if (userMembers.length > 0) {
    try {
      // Use the first user as the project manager (even though they're USER role)
      const projectManager = userMembers[0];

      const project = await prisma.project.create({
        data: {
          name: "TaskForge Development",
          description: "Main project for developing the TaskForge application",
          managerId: projectManager.id,
          members: {
            create: userMembers.map((user) => ({ userId: user.id })),
          },
        },
      });

      console.log(`✅ Created project: ${project.name}`);

      // Create sample tasks
      console.log("📋 Creating sample tasks...");
      const sampleTasks = [
        {
          title: "Setup Authentication System",
          description:
            "Implement JWT-based authentication with role management",
          status: "PENDING",
          priority: "HIGH",
          assigneeId: userMembers[0].id,
          position: 1,
        },
        {
          title: "Design Database Schema",
          description: "Create comprehensive Prisma schema for task management",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assigneeId: userMembers[1].id,
          position: 2,
        },
        {
          title: "Build Kanban Board",
          description: "Implement drag-and-drop Kanban board functionality",
          status: "DONE",
          priority: "MEDIUM",
          assigneeId: userMembers[2]?.id || userMembers[0].id,
          position: 3,
        },
        {
          title: "Create Task Exchange System",
          description: "Allow users to request help and exchange tasks",
          status: "PENDING",
          priority: "MEDIUM",
          assigneeId: userMembers[3]?.id || userMembers[0].id,
          position: 4,
        },
        {
          title: "Implement User Dashboard",
          description: "Create responsive user dashboard with task overview",
          status: "PENDING",
          priority: "MEDIUM",
          assigneeId: userMembers[4]?.id || userMembers[0].id,
          position: 5,
        },
        {
          title: "Add Real-time Notifications",
          description: "Implement WebSocket-based real-time notifications",
          status: "PENDING",
          priority: "LOW",
          assigneeId: userMembers[5]?.id || userMembers[0].id,
          position: 6,
        },
      ];

      for (const [index, taskData] of sampleTasks.entries()) {
        const task = await prisma.task.create({
          data: {
            ...taskData,
            projectId: project.id,
            createdById: projectManager.id,
            dueDate: new Date(Date.now() + (7 + index) * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`✅ Created task: ${task.title}`);
      }
    } catch (error) {
      console.error("❌ Error creating sample data:", error.message);
    }
  }

  console.log("\n📊 Seeding Summary:");
  try {
    const userCounts = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    userCounts.forEach((group) => {
      console.log(`   ${group.role}: ${group._count.role} users`);
    });

    const totalUsers = await prisma.user.count();
    console.log(`   Total Users: ${totalUsers}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Default Login Credentials (all with password123):");
  console.log(
    "   Email: user1@example.com    | Username: john_doe      | Role: USER",
  );
  console.log(
    "   Email: user2@example.com    | Username: jane_smith    | Role: USER",
  );
  console.log(
    "   Email: user3@example.com    | Username: demo_user     | Role: USER",
  );
  console.log(
    "   Email: user4@example.com    | Username: alex_brown    | Role: USER",
  );
  console.log(
    "   Email: user5@example.com    | Username: emma_davis    | Role: USER",
  );
  console.log(
    "   ... and 10 more users (user6@example.com to user15@example.com)",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
