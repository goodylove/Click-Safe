
import { Check, Trash2, Archive } from "lucide-react"

export default function InboxScanPage() {
  const emails = [
    { id: 1, sender: "john@example.com", subject: "Important Update", status: "safe", date: "2025-03-11" },
    { id: 2, sender: "noreply@bank.com", subject: "Verify Your Account", status: "suspicious", date: "2025-03-11" },
    { id: 3, sender: "newsletter@company.com", subject: "Weekly Newsletter", status: "safe", date: "2025-03-10" },
    { id: 4, sender: "alert@security.com", subject: "Security Alert", status: "malicious", date: "2025-03-10" },
  ]

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "suspicious":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "malicious":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="md:p-6 p-2 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Inbox Scan</h1>
          <p className="text-slate-400 mt-1">Monitor and manage suspicious emails</p>
        </div>
        <button className="bg-linear-to-r from-sidebar-sm to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-md transition-colors">
          Scan Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brwn border border-zinc-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm font-medium">Total Emails</div>
          <div className="text-3xl font-bold text-slate-50 mt-2">248</div>
        </div>
        <div className="bg-brwn border border-zinc-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm font-medium">Safe</div>
          <div className="text-3xl font-bold text-green-400 mt-2">215</div>
        </div>
        <div className="bg-brwn border border-zinc-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm font-medium">Suspicious</div>
          <div className="text-3xl font-bold text-yellow-400 mt-2">24</div>
        </div>
        <div className="bg-brwn border border-zinc-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm font-medium">Malicious</div>
          <div className="text-3xl font-bold text-red-400 mt-2">9</div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-brwn border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className=" border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Sender</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-300">{email.sender}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{email.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(email.status)}`}>
                      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{email.date}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="p-1.5 hover:bg-slate-600 rounded-md transition-colors text-slate-400 hover:text-slate-200">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded-md transition-colors text-slate-400 hover:text-slate-200">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded-md transition-colors text-slate-400 hover:text-slate-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}