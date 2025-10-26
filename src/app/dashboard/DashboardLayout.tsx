"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard-components/Sidebar";
import Header from "@/components/dashboard-components/Header";
import { useAuthStore } from "@/lib/useAuthStore";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true); // new loading state
  const router = useRouter();

  useEffect(() => {
    async function fetchUserFromToken() {
      try {
        const response = await fetch("/api/auth", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUserFromToken();
  }, [router, setUser]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Show nothing (or spinner) while loading
  if (loading) return <div>Loading...</div>;

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
