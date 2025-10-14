"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard-components/Sidebar";
import Header from "@/components/dashboard-components/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-auto">
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
