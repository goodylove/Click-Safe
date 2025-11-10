import { Check, CreditCard, Download, Calendar } from "lucide-react"

export default function SubscriptionPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic email scanning",
        "5 scans per month", 
        "Community support",
        "Gmail & Outlook support"
      ],
      current: false,
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "Unlimited email scans",
        "Advanced AI detection",
        "Priority email support",
        "All email providers",
        "Export threat reports",
        "API access"
      ],
      current: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Dedicated account manager", 
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment",
        "Training & onboarding"
      ],
      current: false,
      popular: false
    },
  ]

  const billingHistory = [
    { id: 1, description: "Pro Plan - March 2025", date: "Mar 11, 2025", amount: "$9.00", status: "Paid" },
    { id: 2, description: "Pro Plan - February 2025", date: "Feb 11, 2025", amount: "$9.00", status: "Paid" },
    { id: 3, description: "Pro Plan - January 2025", date: "Jan 11, 2025", amount: "$9.00", status: "Paid" },
  ]

  return (
    <div className="p-6 space-y-6 bg-sidebar-bg min-h-screen font-satoshi">
      {/* Header */}
      <div className="bg-sidebar-sm rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
        <p className="text-text-sm mt-1">Manage your plan and view billing history</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-brwn border border-gray-100 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-200">Current Plan</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Active
              </span>
            </div>
            <p className="text-xl font-bold text-gray-100">Pro Plan</p>
            <p className="text-gray-400 text-sm mt-1">$9/month • Next billing: April 11, 2025</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Update Payment
            </button>
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
              Cancel Plan
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-sidebar-bg border rounded-lg p-6 transition-all ${
              plan.current
                ? "border-default ring-2 ring-blue-100"
                : plan.popular
                ? "border-default/50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Plan Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-gray-200">{plan.price}</span>
                  <span className="text-gray-200 text-sm">{plan.period}</span>
                </div>
              </div>
              {plan.current && (
                <span className="px-2 py-1 bg-default/10 text-default text-xs font-medium rounded">
                  Current
                </span>
              )}
              {plan.popular && !plan.current && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Most Popular
                </span>
              )}
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-200 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <button
              className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                plan.current
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : plan.popular
                  ? "bg-default text-white hover:bg-main"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="bg-sidebar-bg border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Billing History</h3>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-300 text-sm rounded hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="space-y-3">
          {billingHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg  transition-colors"
            >
              <div className="flex items-start gap-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-200 text-sm">{item.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-green-600 text-sm font-medium">{item.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-200 font-semibold">{item.amount}</span>
                <button className="text-default hover:text-main text-sm font-medium">
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button */}
        <div className="text-center mt-4">
          <button className="text-default hover:text-main text-sm font-medium">
            Load More Billing History
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-20 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help with Your Subscription?</h3>
        <p className="text-gray-100 text-sm mb-4">
          Have questions about billing or want to change your plan? Our support team is here to help.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-default text-white text-sm font-medium rounded hover:bg-main transition-colors">
            Contact Support
          </button>
          <button className="px-4 py-2 border border-gray-400 text-gray-50 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  )
}