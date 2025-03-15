import Link from "next/link";
import { JSX, useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  link?: string;
  svg: JSX.Element;
  dropdown?: { name: string; link: string; svg?: JSX.Element }[];
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems, isCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="flex-1 py-2 overflow-y-auto scrollbar-hide">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => toggleDropdown(index)}
              className={`flex items-center px-2 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              } ${openDropdown === index ? "bg-gray-600" : ""}`}
            >
              <motion.span
                className="text-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.svg}
              </motion.span>
              {!isCollapsed && (
                <motion.span
                  className="ml-3 flex-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
              {!isCollapsed && (
                <motion.span
                  className="text-xs"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: openDropdown === index ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openDropdown === index ? "▾" : "▸"}
                </motion.span>
              )}
            </div>
          ) : (
            <Link
              href={item.link || "#"}
              onClick={() => {
                setActiveLink(item.link || "#");
                closeDropdown(); // Close any open dropdown when clicking a normal link
              }}
              className={`flex items-center px-2 py-2 ${
                activeLink === item.link ? "text-white font-bold" : "text-gray-300"
              } hover:bg-gray-700 cursor-pointer rounded-md text-sm transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <motion.span
                className="text-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.svg}
              </motion.span>
              {!isCollapsed && (
                <motion.span
                  className="ml-3 flex-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          )}

          {/* Dropdown Animation */}
          <AnimatePresence>
            {!isCollapsed && item.dropdown && openDropdown === index && (
              <motion.div
                className="ml-5 mt-1 border-l border-gray-600 pl-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    onClick={() => {
                      setActiveLink(subItem.link);
                      // Do NOT close the dropdown when clicking a submenu
                    }}
                    className={`flex items-center gap-2 px-2 py-1 ${
                      activeLink === subItem.link ? "text-white font-bold" : "text-gray-400"
                    } hover:bg-gray-700 text-sm rounded-md transition-all duration-300`}
                  >
                    {!subItem.svg && (
                      <FaAngleDoubleRight className="text-gray-500 text-xs" />
                    )}
                    {subItem.svg && (
                      <motion.span
                        className="text-gray-500 text-xs"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {subItem.svg}
                      </motion.span>
                    )}
                    {subItem.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
