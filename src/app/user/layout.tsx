"use client";

import { useState } from "react";
import Sidebar from "@/components/user/Sidebar";
import Topbar from "@/components/user/Topbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex flex-col flex-1">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
