"use client";

import { useState } from "react";
import Modal from "./SidebarModal";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import { menuItems } from "./menuItems";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="w-60 bg-gray-800 text-white flex flex-col h-screen fixed left-0 top-0">
      <SidebarHeader onClick={() => setIsModalOpen(true)} />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      <SidebarMenu menuItems={menuItems} openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
    </div>
  );
};

export default Sidebar;
