
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function IndustryMoodPage() {
  const threatData = [
    { name: "Finance", threats: 45, incidents: 12 },
    { name: "Healthcare", threats: 38, incidents: 8 },
    { name: "Tech", threats: 52, incidents: 15 },
    { name: "Retail", threats: 28, incidents: 6 },
    { name: "Education", threats: 22, incidents: 4 },
  ]

  const trendData = [
    { month: "Jan", volume: 320, severity: 80 },
    { month: "Feb", volume: 420, severity: 95 },
    { month: "Mar", volume: 380, severity: 88 },
    { month: "Apr", volume: 510, severity: 102 },
    { month: "May", volume: 480, severity: 98 },
  ]

  return (
    <div className="md:p-6 p-2 space-y-6 py-10 ">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Industry Mood</h1>
        <p className="text-slate-400 mt-1">Threat landscape and security trends across industries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm">Global Threat Level</p>
          <p className="text-3xl font-bold text-red-400 mt-2">High</p>
          <p className="text-slate-400 text-xs mt-2">↑ 12% this week</p>
        </div>
        <div className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm">Active Campaigns</p>
          <p className="text-3xl font-bold text-slate-50 mt-2">24</p>
          <p className="text-slate-400 text-xs mt-2">Monitored globally</p>
        </div>
        <div className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm">Affected Industries</p>
          <p className="text-3xl font-bold text-slate-50 mt-2">8</p>
          <p className="text-slate-400 text-xs mt-2">Out of 10 major</p>
        </div>
        <div className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm">Response Time</p>
          <p className="text-3xl font-bold text-green-400 mt-2">2.3s</p>
          <p className="text-slate-400 text-xs mt-2">Average detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-50 mb-4">Threats by Industry</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="threats" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-50 mb-4">Threat Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Line type="monotone" dataKey="severity" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
