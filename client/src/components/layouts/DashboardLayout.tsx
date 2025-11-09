import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen text-sm flex flex-col md:grid md:grid-cols-[260px_1fr] bg-sidebar-bg transition-all duration-300">
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full bg-linear-to-b  from-sidebar-sm to-sidebar-bg  flex flex-col justify-between p-5 w-64 md:w-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-8">
            <svg width="26" height="26" fill="var(--color-default)" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
            </svg>
            <span className="text-xl font-semibold text-white">Clicksafe</span>
          </div>

          <nav className="flex flex-col space-y-1">
            {["Inbox Scan", "Threat Report", "Subscription", "Industry Mood", "Help & Support"].map((item, i) => (
              <button
                key={i}
                className={`text-left px-3 py-2 rounded-lg transition-all duration-200 text-text-sm hover:bg-sidebar-sm hover:text-white ${
                  item === "Threat Report" && "bg-black text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 mt-8 text-sm text-text-sm">
          <p className="cursor-pointer hover:text-white transition">Settings</p>
          <p className="cursor-pointer hover:text-white transition">Account</p>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-default text-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 8.586L3.707 2.293 2.293 3.707 8.586 10l-6.293 6.293 1.414 1.414L10 11.414l6.293 6.293 1.414-1.414L11.414 10l6.293-6.293-1.414-1.414L10 8.586z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <main className="p-6 md:p-8 overflow-y-auto bg-black transition-all duration-300">
        <div className="container mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
