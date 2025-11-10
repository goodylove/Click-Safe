import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  HelpCircle,
  Lock,
  Eye,
  Globe,
  Menu,
  X,
  Code,
  Download,
  Settings,
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "getting-started", label: "Getting Started", icon: Download },
    { id: "how-it-works", label: "How It Works", icon: Settings },
    { id: "api-reference", label: "API Reference", icon: Code },
    { id: "troubleshooting", label: "Troubleshooting", icon: HelpCircle },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-sm rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">ClickSafe Docs</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-3 py-2 rounded text-left flex items-center gap-2 transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <div className="pt-16 max-w-4xl mx-auto px-4 py-8">
        <section className="py-8 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ClickSafe Documentation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Learn how to install, use, and integrate ClickSafe - the open-source
            phishing detection extension.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-sidebar-sm text-white rounded text-sm font-medium hover:bg-sidebar-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Install Extension
            </button>
            <a
              href="https://github.com/goodylove/Click-Safe"
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              View Source Code
            </a>
          </div>
        </section>

        <section id="getting-started" className="py-8">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Installation</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Download the extension</p>
                    <p className="text-sm text-gray-600">
                      Get the latest build from our GitHub releases
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Load in Chrome</p>
                    <p className="text-sm text-gray-600">
                      Go to{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        chrome://extensions/
                      </code>
                      , enable Developer Mode, and load the unpacked extension
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Start the backend</p>
                    <p className="text-sm text-gray-600">
                      Run{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        npm run dev
                      </code>{" "}
                      in the backend directory
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Important Setup Note
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Make sure your backend server is running on port 4000. The
                    extension won't work without it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              ClickSafe scans emails in real-time using a combination of pattern
              matching and AI analysis. Here's what happens when you click
              "Scan":
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Content Extraction</h4>
                </div>
                <p className="text-sm text-gray-600">
                  The extension reads the email content from Gmail, Outlook, or
                  other supported providers.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">AI Analysis</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Content is sent to our backend for phishing detection using
                  machine learning models.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-sidebar-bg" />
                  <h4 className="font-semibold">Risk Assessment</h4>
                </div>
                <p className="text-sm text-gray-600">
                  We analyze links, sender information, and content patterns to
                  calculate a risk score.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-sidebar-bg" />
                  <h4 className="font-semibold">Results Display</h4>
                </div>
                <p className="text-sm text-gray-600">
                  You get an instant verdict with specific findings and
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="api-reference" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">API Reference</h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-mono text-sm font-semibold">
                  POST /analyze-email
                </h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Analyze email content for phishing indicators
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Request Body</p>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      {`{
  "content": "Email content text",
  "url": "Page URL for context",
  "type": "EMAIL"
}`}
                    </pre>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Response</p>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      {`{
  "success": true,
  "analysis": {
    "overallRisk": "HIGH",
    "safeToClick": false,
    "confidence": "HIGH",
    "summary": " DANGER: This is a phishing scam...",
    "recommendations": [
      {
        "priority": "CRITICAL",
        "message": "This email is a phishing attempt...",
        "action": "DELETE_EMAIL",
        "icon": ""
      }
    ],
    "detailedAnalysis": {
      "links": [
        {
          "text": "SECURE YOUR ACCOUNT NOW",
          "href": "http://paypal-secure-verification.com/account/verify",
          "analysis": {
            "overallRisk": "HIGH",
            "safetyAnalysis": {
              "safetyLevel": "DANGEROUS",
              "riskFactors": ["non_https", "suspicious_keyword_verify"]
            },
            "domainAnalysis": {
              "trustLevel": "LOW",
              "riskFactors": ["suspicious_pattern"]
            }
          }
        }
      ]
    }
  },
  "timestamp": "2025-11-09T22:48:59.930Z"
}
`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="troubleshooting" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-sidebar-sm pl-4 py-1">
              <h4 className="font-semibold">
                "Cannot access page content" error
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Make sure you're on a supported email provider (Gmail, Outlook)
                and have the extension properly installed.
              </p>
            </div>

            <div className="border-l-4 border-sidebar-sm pl-4 py-1">
              <h4 className="font-semibold">Backend connection issues</h4>
              <p className="text-sm text-gray-600 mt-1">
                Verify the backend server is running on port 4000 and check the
                console for any error messages.
              </p>
            </div>

            <div className="border-l-4 border-sidebar-sm pl-4 py-1">
              <h4 className="font-semibold">
                Scan not working on specific pages
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                ClickSafe only works when viewing individual emails, not inbox
                views or other pages.
              </p>
            </div>
          </div>
        </section>

        <section id="privacy" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Privacy & Data Handling</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Local Processing</h4>
                <p className="text-sm text-gray-600">
                  Email content is processed locally in your browser before
                  being sent for analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">No Data Storage</h4>
                <p className="text-sm text-gray-600">
                  We don't store your emails or personal information. Analysis
                  results are temporary.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Open Source</h4>
                <p className="text-sm text-gray-600">
                  All code is publicly available for review and audit on GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-gray-200 mt-8">
          <div className="text-center text-gray-600">
            <p>
              Need help? Open an issue on our GitHub repository or contact the
              development team.
            </p>
            <p className="text-sm mt-2">
              ClickSafe © 2025 - Open Source Phishing Detection
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
