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
        <path fill="currentColor" d="M13 6H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM7 4h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
      </svg>
    ),
    name: "Authentication",
    path: "/admin/authentication",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill="currentColor" d="M13 6H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM7 4h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
      </svg>
    ),
    name: "Test Add",
    path: "/admin/test-add",
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-gradient-to-b from-gray-900/80 to-gray-950/90 backdrop-blur-xl border-gray-800 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r
        ${
          isExpanded || isMobileOpen
            ? "w-[280px]"
            : isHovered
            ? "w-[280px]"
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
        <Link to="/admin" className="font-bold text-xl bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent hover:scale-110 transition-transform">
          {isExpanded || isHovered || isMobileOpen ? "🔬 MedHub Admin" : "M"}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear flex-1">
        <nav className="mb-6">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-brand-500/30 to-brand-600/20 border border-brand-500/50 text-brand-300 shadow-lg shadow-brand-500/20"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent"
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

        {/* Footer Info */}
        <div className={`mt-auto pt-6 border-t border-gray-800 ${!isExpanded && !isHovered ? "lg:hidden" : ""}`}>
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <p className="text-xs text-gray-400 mb-2">✨ Admin Paneli</p>
            <p className="text-xs text-brand-300 font-semibold">Medical Hub v2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
