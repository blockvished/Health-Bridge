"use client";

import React, { useState } from "react";
import Sidebar from "./_common/Sidebar";
import Topbar from "./_common/Topbar";
import Footer from "./_common/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-gray-50 flex flex-col w-screen">
      {/* Topbar - Visible only on small screens */}
      <div className="block md:hidden">
        <Topbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      </div>

      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} />
        
        <div
          className={`flex-1 flex flex-col p-6 transition-all ${
            isCollapsed ? "ml-20" : "ml-60"
          }`}
        >
          {/* Topbar - Visible only on medium and larger screens */}
          <div className="hidden md:block">
            <Topbar onToggleSidebar={() => setIsCollapsed(isCollapsed)} />
          </div>

          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
