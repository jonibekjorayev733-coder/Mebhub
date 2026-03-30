import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/AdminSidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill="currentColor" d="M2 5h4v4H2V5zm6 0h4v4H8V5zm6 0h4v4h-4V5zM2 11h4v4H2v-4zm6 0h4v4H8v-4zm6 0h4v4h-4v-4z" />
      </svg>
    ),
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill="currentColor" d="M3 4h3v3H3V4zm4 0h3v3H7V4zm4 0h3v3h-3V4zm4 0h3v3h-3V4zM3 8h3v3H3V8zm4 0h3v3H7V8zm4 0h3v3h-3V8zm4 0h3v3h-3V8zM3 12h3v3H3v-3zm4 0h3v3H7v-3zm4 0h3v3h-3v-3zm4 0h3v3h-3v-3z" />
      </svg>
    ),
    name: "Mavzular",
    path: "/admin/topics",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill="currentColor" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" />
      </svg>
    ),
    name: "Foydalanuvchilar",
    path: "/admin/users",
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-gray-900/50 backdrop-blur-md border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="font-bold text-xl bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">
          {isExpanded || isHovered || isMobileOpen ? "MedHub Admin" : "MA"}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-orange-500/30 to-cyan-500/30 border border-orange-500/50 text-orange-300"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                    } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
                  >
                    <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
