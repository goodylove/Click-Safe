"use client"

import { Search, MessageCircle, Mail, BookOpen, AlertCircle } from "lucide-react"

export default function HelpSupportPage() {
  const faqs = [
    {
      question: "How do I scan my inbox?",
      answer: "Navigate to Inbox Scan and click the 'Scan Now' button. Clicksafe will analyze your emails for threats.",
    },
    {
      question: "What does the threat report show?",
      answer: "The threat report displays detected suspicious emails, their risk levels, and recommended actions.",
    },
    {
      question: "How often is my inbox scanned?",
      answer: "Your scan frequency depends on your subscription plan. Pro users get unlimited scans.",
    },
    {
      question: "Can I recover blocked emails?",
      answer: "Yes, blocked emails are stored in your archive for 30 days. You can review and restore them.",
    },
  ]

  return (
    <div className="md:p-6 p-2 space-y-6 py-10 ">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Help & Support</h1>
        <p className="text-slate-400 mt-1">Get help with Clicksafe and report issues</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          placeholder="Search for help..."
          className="w-full pl-12 bg-slate-800 border border-slate-700 text-slate-50 placeholder:text-slate-500 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
          <MessageCircle className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-50">Live Chat</h3>
          <p className="text-slate-400 text-sm mt-2">Chat with our support team in real-time</p>
          <button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white w-full py-2 rounded-md transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
          <Mail className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-50">Email Support</h3>
          <p className="text-slate-400 text-sm mt-2">Get responses within 24 hours</p>
          <button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white w-full py-2 rounded-md transition-colors">
            Send Email
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
          <BookOpen className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-50">Documentation</h3>
          <p className="text-slate-400 text-sm mt-2">Browse our knowledge base</p>
          <button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white w-full py-2 rounded-md transition-colors">
            View Docs
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold text-slate-50 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-slate-50 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                {faq.question}
              </h3>
              <p className="text-slate-400 mt-3">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}