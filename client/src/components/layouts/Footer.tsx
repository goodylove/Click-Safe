import { useEffect, useState } from "react"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <footer
      className={`relative border-t border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
              <span className="text-xl font-bold text-white">Clicksafe</span>
            </div>
            <p className="text-sm text-slate-400">Advanced email threat detection powered by AI</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Features", "Security", "Pricing", "Status"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Privacy", "Terms", "Security", "Compliance"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>© 2025 Clicksafe. All rights reserved.</div>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="hover:text-cyan-400 transition-colors duration-300">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
