import Link from "next/link";

interface MenuItem {
  name: string;
  link?: string;
  svg: string;
  dropdown?: { name: string; link: string }[];
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  openDropdown: number | null;
  toggleDropdown: (index: number) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems, openDropdown, toggleDropdown }) => {
  return (
    <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.dropdown ? (
            <div
              onClick={() => toggleDropdown(index)}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
            >
              <span className="mr-2">{item.svg}</span>
              <span>{item.name}</span>
              <span className="ml-auto">{openDropdown === index ? "▾" : "▸"}</span>
            </div>
          ) : (
            <Link href={item.link || "#"} className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm">
              <span className="mr-2">{item.svg}</span>
              <span>{item.name}</span>
            </Link>
          )}

          {item.dropdown && openDropdown === index && (
            <div className="ml-6">
              {item.dropdown.map((subItem, subIndex) => (
                <Link key={subIndex} href={subItem.link} className="block px-4 py-1 text-gray-400 hover:bg-gray-700 text-sm">
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
