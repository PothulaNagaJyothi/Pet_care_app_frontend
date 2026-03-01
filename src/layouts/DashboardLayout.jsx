import { useState, useRef, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const getPageTitle = () => {
    if (location.pathname.includes("pets")) return "Pets";
    if (location.pathname.includes("vaccinations")) return "Vaccinations";
    if (location.pathname.includes("appointments")) return "Appointments";
    if (location.pathname.includes("medications")) return "Medications";
    if (location.pathname.includes("weight")) return "Weight Tracking";
    if (location.pathname.includes("journal")) return "Health Journal";
    if (location.pathname.includes("routines")) return "Routines";
    if (location.pathname.includes("insurance")) return "Insurance";
    if (location.pathname.includes("emergency-vets")) return "Emergency Vets";
    if (location.pathname.includes("community")) return "Community";
    if (location.pathname.includes("tips")) return "Expert Care Tips";
    if (location.pathname.includes("nutrition")) return "Nutrition & Meals";
    if (location.pathname.includes("ai-assistant")) return "Virtual AI Assistant";
    if (location.pathname.includes("settings")) return "Alerts & Settings";
    return "Dashboard Overview";
  };

  const userInitial = user?.email?.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px]
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800/60
        transform ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        md:static md:translate-x-0 md:z-auto md:shadow-none
        flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
              P
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                PetCare
              </h2>
            </div>
          </div>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {[
            { path: "/dashboard", label: "Dashboard", icon: "📊" },
            { path: "/dashboard/pets", label: "Pets", icon: "🐾" },
            { path: "/dashboard/vaccinations", label: "Vaccinations", icon: "💉" },
            { path: "/dashboard/appointments", label: "Appointments", icon: "📅" },
            { path: "/dashboard/medications", label: "Medications", icon: "💊" },
            { path: "/dashboard/weight", label: "Weight Tracking", icon: "⚖️" },
            { path: "/dashboard/journal", label: "Health Journal", icon: "📓" },
            { path: "/dashboard/routines", label: "Routines", icon: "🔄" },
            { path: "/dashboard/insurance", label: "Insurance", icon: "🛡️" },
            { path: "/dashboard/emergency-vets", label: "Emergency Vets", icon: "🚑" },
            { path: "/dashboard/community", label: "Community", icon: "💬" },
            { path: "/dashboard/tips", label: "Care Tips", icon: "💡" },
            { path: "/dashboard/nutrition", label: "Nutrition", icon: "🍏" },
            { path: "/dashboard/ai-assistant", label: "AI Vet", icon: "🤖" },
            { path: "/dashboard/settings", label: "Settings", icon: "⚙️" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group ${isActive
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`
              }
            >
              <span className={`text-lg transition-transform duration-200 group-hover:scale-110`}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shadow-sm dark:shadow-none">

          {/* Hamburger (Mobile Only) */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            {/* Dynamic Page Title */}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          {/* Profile & Theme Section */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div
              className="relative flex items-center gap-3"
              ref={dropdownRef}
            >
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 cursor-pointer p-1.5 -m-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {userInitial}
                </div>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-56 p-2 shadow-2xl z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pet Parent
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;