"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./_common/Sidebar";
import Topbar from "./_common/Topbar";
import Footer from "./_common/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} />

        {/* Main Content Area */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isCollapsed ? "md:ml-20 ml-0" : "md:ml-60 ml-0"
          }`}
        >
          {/* Topbar (adjusts on mobile when sidebar is open) */}
          <div
            className={`transition-all duration-300 ${
              isCollapsed ? "md:pl-0 pl-20" : "md:pl-0 pl-60"
            }`}
          >
            <Topbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
          </div>

          {/* Page Content */}
          <main className="flex-1 p-4">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
