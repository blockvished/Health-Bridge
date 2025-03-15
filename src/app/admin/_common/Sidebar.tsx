"use client";

import { useState } from "react";
import Modal from "./SidebarModal";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import { menuItems } from "./menuItems";

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className={`bg-gray-800 text-white flex flex-col h-screen fixed left-0 top-0 transition-all ${isCollapsed ? "w-20" : "w-60"}`}>
      {!isCollapsed && <SidebarHeader onClick={() => setIsModalOpen(true)} />}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      <SidebarMenu menuItems={menuItems} openDropdown={openDropdown} toggleDropdown={toggleDropdown} isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
