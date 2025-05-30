"use client";

import React, { useEffect, useState } from "react";
import SidebarPatient from "../_common/SidebarPatient";
import TopbarPatient from "../_common/TopbarPatient";
import Footer from "../_common/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize with a default value that works for server rendering
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Reset mobile sidebar state when switching to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        <SidebarPatient
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
          />
        <div
          className={`flex flex-col w-full transition-all duration-300 ${
            isCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
          } ${isMobile && sidebarOpen ? "ml-1/2" : ""}`}
        >
          <TopbarPatient onToggleSidebar={toggleSidebar} />

          <main
            className={`flex-1 p-4 ${isMobile && sidebarOpen ? "ml-1/2" : ""}`}
          >
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
