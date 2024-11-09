import React from "react";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { BotInput } from "@/components/custom/bot-input";
import "../assets/css/dashboard.css";

const DashboardPage = () => {
  return (
    <SidebarLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>This is your Dashboard.</p>
      <BotInput />
    </SidebarLayout>
  );
};

export default DashboardPage;
