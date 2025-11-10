import { Shield, AlertTriangle, CheckCircle, MoreVertical } from "lucide-react";

export default function ThreatReportPage() {
  const threats = [
    {
      id: 1,
      type: "Wire Transfer Scam",
      sender: "ceo@yourcompany-exec.com",
      title: "URGENT: Wire Transfer Needed",
      risk: "High",
      date: "03-11-2025",
      amount: "$48,750",
      blocked: true,
    },
    {
      id: 2,
      type: "Account Phishing",
      sender: "security@google-support.net",
      title: "Your Account Will Be Suspended",
      risk: "High",
      date: "03-11-2025",
      amount: null,
      blocked: true,
    },
    {
      id: 3,
      type: "Malware Attachment",
      sender: "documents@file-share.xyz",
      title: "Invoice #INV-2025-8472",
      risk: "Medium",
      date: "03-10-2025",
      amount: null,
      blocked: false,
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (blocked: boolean) => {
    if (blocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
          <Shield className="w-3 h-3" />
          Blocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
        <AlertTriangle className="w-3 h-3" />
        Flagged
      </span>
    );
  };

  return (
    <div className="md:p-6 p-2 py-10  space-y-6  min-h-screen">
      <div className="bg-brwn rounded-lg border border-zinc-700 p-6">
        <h1 className="text-2xl font-bold text-white">Threat Report</h1>
        <p className="text-gray-100 mt-1">
          Overview of suspicious emails detected by ClickSafe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brwn border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Total Scans</p>
              <p className="text-2xl font-bold text-white mt-1">142</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-brwn border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Threats Found</p>
              <p className="text-2xl font-bold text-red-600 mt-1">23</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-brwn border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">High Risk</p>
              <p className="text-2xl font-bold text-red-700 mt-1">15</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-brwn border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Blocked</p>
              <p className="text-2xl font-bold text-green-600 mt-1">18</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brwn border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Threats</h2>
          <p className="text-sm text-gray-200 mt-1">
            Emails flagged as potential phishing attempts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Email Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-brwn divide-y divide-gray-500">
              {threats.map((threat) => (
                <tr
                  key={threat.id}
                  className="hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getRiskColor(
                          threat.risk
                        )}`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          threat.risk === "High"
                            ? "text-red-700"
                            : threat.risk === "Medium"
                            ? "text-yellow-700"
                            : "text-green-700"
                        }`}
                      >
                        {threat.risk}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {threat.title}
                      </div>
                      {threat.amount && (
                        <div className="text-sm text-red-600 font-medium">
                          {threat.amount}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-mono">
                      {threat.sender}
                    </div>
                    <div className="text-xs text-gray-500">
                      Spoofed domain detected
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{threat.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {threat.date}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(threat.blocked)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-200 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-sidebr-bg border-t ">
          <div className="flex items-center justify-between text-sm text-gray-200">
            <span>Showing 3 of 23 threats</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded  transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded  transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brwn border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
            View All Threats
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
