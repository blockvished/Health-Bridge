"use client";

import { useState } from "react";
import Modal from "./SidebarModal"; // Assuming you have a Modal component
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import { menuItems } from "./menuItems";

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle dropdown when clicking the item
  const toggleDropdown = (index: number | null) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Toggle modal visibility
  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div
      className={`bg-gray-800 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? "w-20 opacity-90" : "w-60 opacity-100"}`}
    >
      {/* Sidebar Header */}
      <SidebarHeader onClick={handleModalToggle} isCollapsed={isCollapsed} />

      {/* Toggleable Modal */}
      {isModalOpen && <Modal onClose={handleModalToggle} />}

      {/* Sidebar Menu */}
      <SidebarMenu
        menuItems={menuItems}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};

export default Sidebar;
