import React from "react";
import { useAuth } from "../context";
import { Layout } from "../components/layout";
import {
  UserDashboard,
  ManagerDashboard,
  ModeratorDashboard,
  AdminDashboard,
} from "../components/dashboard";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const renderRoleDashboard = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "MODERATOR":
        return <ModeratorDashboard user={user} />;
      case "MANAGER":
        return <ManagerDashboard user={user} />;
      case "USER":
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <Layout user={user} onLogout={logout}>
      {renderRoleDashboard()}
    </Layout>
  );
};

export default Dashboard;
