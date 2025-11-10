import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { label: "Inbox Scan", path: "/dashboard/inbox-scan" },
    { label: "Threat Report", path: "/dashboard/threat-report" },
    { label: "Subscription", path: "/dashboard/subscription" },
    { label: "Settings", path: "/dashboard/settings" },
    { label: "Industry Mood", path: "/dashboard/industry-mood" },
    { label: "Help & Support", path: "/dashboard/help-support" },
    { label: "Account", path: "/dashboard/account" },
  ];

  return (
    <div className="flex min-h-screen text-sm bg-black font-satoshi">
      <aside
        className={`fixed top-0 left-0 h-screen  w-64 bg-linear-to-b from-sidebar-sm to-sidebar-bg flex flex-col justify-between p-5 transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center gap-2 mb-8 shrink-0">
          <img src="/logo.png" alt="Logo" />
        </div>

        <nav className="flex-1 flex flex-col space-y-1 font-bold overflow-y-auto pr-1">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `text-left px-3 py-2 rounded-lg transition-all duration-200 text-text-sm hover:bg-sidebar-sm hover:text-white shrink-0 ${
                  isActive ? "bg-black text-white" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 mt-4 text-sm text-text-sm shrink-0">
          <p className="cursor-pointer hover:text-white transition">Settings</p>
          <p className="cursor-pointer hover:text-white transition">Account</p>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-default text-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 8.586L3.707 2.293 2.293 3.707 8.586 10l-6.293 6.293 1.414 1.414L10 11.414l6.293 6.293 1.414-1.414L11.414 10l6.293-6.293-1.414-1.414L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-black min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
