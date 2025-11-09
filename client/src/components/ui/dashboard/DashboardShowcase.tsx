
import { useEffect, useState } from "react"
import dashboardImage from "../../../assets/dashboard.png";

export default function DashboardShowcase() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div
          className={`text-center space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">Advanced Threat Detection in Action</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-time monitoring and comprehensive reporting to keep your organization protected
          </p>
        </div>

        <div
          className={`relative group transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

          <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative bg-slate-950 rounded-xl overflow-hidden">
            <img
              src={dashboardImage}
              alt="Clicksafe Dashboard - Threat Report"
              width={1200}
              height={700}
              className="w-full h-auto object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
              <div className="text-center space-y-2">
                <p className="text-white font-semibold">Experience Real-Time Protection</p>
                <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-colors duration-300">
                  View Features
                </button>
              </div>
            </div>
          </div>

          <div className="absolute -top-8 left-1/4 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-8 right-1/4 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            {
              icon: "🎯",
              title: "Intelligent Detection",
              description: "AI-powered analysis detects sophisticated threats in real-time",
            },
            {
              icon: "📊",
              title: "Comprehensive Reports",
              description: "Detailed threat analytics and actionable insights",
            },
            {
              icon: "🔒",
              title: "Enterprise Security",
              description: "Bank-grade encryption and compliance standards",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
