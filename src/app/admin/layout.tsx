"use client";

import React, { useEffect, useState } from "react";
import SidebarDoctor from "./_common/SidebarDoctor";
import SidebarPatient from "./_common/SidebarPatient";
import SidebarAdmin from "./_common/SidebarAdmin ";
import TopbarDoctor from "./_common/TopbarDoctor";
import TopbarPatient from "./_common/TopbarPatient";
import TopbarAdmin from "./_common/TopbarAdmin";
import Footer from "./_common/Footer";

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
        <SidebarDoctor
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
        {/* <SidebarPatient
          isCollapsed={isCollapsed} 
          isMobile={isMobile} 
          sidebarOpen={sidebarOpen} 
        />        */}
         
        {/* <SidebarAdmin
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        /> */}
        <div
          className={`flex flex-col w-full transition-all duration-300 ${
            isCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
          } ${isMobile && sidebarOpen ? "ml-1/2" : ""}`}
        >
          {/* <TopbarDoctor onToggleSidebar={toggleSidebar} /> */}
          <TopbarAdmin onToggleSidebar={toggleSidebar} />
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
