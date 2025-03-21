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
    <div className=" bg-gray-50">
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} />
        <div
          className={`flex-1 flex flex-col p-6 transition-all ${
            isCollapsed ? "ml-20" : "ml-60"
          }`}
        >
          <Topbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}