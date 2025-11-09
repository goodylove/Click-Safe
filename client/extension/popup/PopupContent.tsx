
import { useState, useEffect } from "react"
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
  History,
  Settings,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ScanText,
} from "lucide-react"

interface Finding {
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH"
  explanation: string
  recommendation: string
}

interface Analysis {
  riskScore: number
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS"
  findings: Finding[]
  confidence: number
  timestamp?: string
}

declare const chrome: any

export default function PopupContent() {
  const [scanning, setScanning] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasHistory, setHasHistory] = useState(false)
  const [expandedFinding, setExpandedFinding] = useState<number | null>(null)

  useEffect(() => {
    const checkHistory = async () => {
      chrome.storage.local.get(['scanHistory'], (result: any) => {
        if (Array.isArray(result.scanHistory) && result.scanHistory.length > 0) {
          setHasHistory(true)
        }
      })
    }
    checkHistory()
  }, [])

  const extractTabContent = async (tabId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId,
        { action: 'EXTRACT_CONTENT' },
        (response: any) => {
          if (chrome.runtime.lastError) {
            reject(new Error('Cannot access page content. Make sure you are on Gmail, Outlook, or a supported page.'))
          } else {
            resolve(response?.content)
          }
        }
      )
    })
  }

  const sendToBackend = async (content: any): Promise<Analysis> => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const response = await fetch('http://localhost:4000/api/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        url: tab.url,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}. Make sure the server is running on port 4000.`)
    }
    
    const result = await response.json()
    return {
      ...result,
      timestamp: new Date().toISOString()
    }
  }

  const storeResults = (analysis: Analysis) => {
    chrome.storage.local.get(['scanHistory'], (result: any) => {
      const history = result.scanHistory || []
      history.unshift({ 
        ...analysis, 
        id: Date.now(), 
        url: window.location.href 
      })
      chrome.storage.local.set({ scanHistory: history.slice(0, 50) })
    })
  }

  const handleScan = async () => {
    setScanning(true)
    setError(null)
    setAnalysis(null)

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id) throw new Error('No active tab found')
      
      const content = await extractTabContent(tab.id)
      if (!content) throw new Error('No content found to scan')
      
      const result = await sendToBackend(content)
      setAnalysis(result)
      storeResults(result)
      
    } catch (err: any) {
      setError(err.message || 'Scan failed. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "SAFE":
        return <CheckCircle className="w-6 h-6" />
      case "SUSPICIOUS":
        return <AlertTriangle className="w-6 h-6" />
      case "MALICIOUS":
        return <AlertCircle className="w-6 h-6" />
      default:
        return <AlertCircle className="w-6 h-6" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "SAFE":
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-700/60",
          text: "text-emerald-400",
          badge: "bg-emerald-900/40 border-emerald-700/40",
        }
      case "SUSPICIOUS":
        return {
          bg: "bg-yellow-950/40",
          border: "border-yellow-700/60",
          text: "text-yellow-400",
          badge: "bg-yellow-900/40 border-yellow-700/40",
        }
      case "MALICIOUS":
        return {
          bg: "bg-red-950/40",
          border: "border-red-700/60",
          text: "text-red-400",
          badge: "bg-red-900/40 border-red-700/40",
        }
      default:
        return { 
          bg: "bg-slate-800/40", 
          border: "border-slate-700/60", 
          text: "text-slate-400",
          badge: "bg-slate-900/40 border-slate-700/40"
        }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-blue-500"
      default:
        return "bg-slate-500"
    }
  }

  const colors = analysis ? getVerdictColor(analysis.verdict) : getVerdictColor("")

  return (
    <div style={{
      height: '1000px'
    }} className="w-96 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 max-h-screen font-sans flex flex-col">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="">
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="flex gap-1">
            {hasHistory && (
              <button 
                onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('history.html') })}
                className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-200"
              >
                <History className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') })}
              className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!analysis && !scanning && !error && (
          <div className="p-5 space-y-4">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed">
                Protect yourself from phishing and malware with AI-powered threat detection. 
                Scan emails and web content in real-time.
              </p>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full py-3 bg-gradient-to-r from-sidebar-sm to-default hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ScanText className="w-5 h-5"/>
                Scan Mail
              </button>
            </div>
            
            <div className="bg-slate-800/20 border-t border-slate-700/30 rounde-lg p-3">
              <p className="text-xs text-slate-400 text-center">
                 Works with Gmail, Outlook, and most webpages
              </p>
            </div>
          </div>
        )}

        {scanning && (
          <div className="p-5 flex items-center justify-center min-h-[200px]">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Analyzing Content</p>
                <p className="text-xs text-slate-400 mt-1">Running security checks...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !analysis && (
          <div className="p-5 space-y-3">
            <div className="bg-red-950/30 border border-red-700/40 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-200">{error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null)
                  handleScan()
                }}
                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                title="Retry scan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            {/* Help Text */}
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-3">
              <p className="text-xs text-slate-400">
                Make sure:
                <br/>• You're on a supported page (Gmail/Outlook)
                <br/>• Backend server is running on port 4000
                <br/>• Page content is accessible
              </p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="p-5 space-y-4">
            {/* Verdict Card */}
            <div
              className={`border rounded-xl p-5 space-y-3 transition-all duration-300 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`${colors.text} flex-shrink-0`}>
                    {getVerdictIcon(analysis.verdict)}
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${colors.text}`}>
                      {analysis.verdict}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Confidence: {analysis.confidence}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-100">
                    {analysis.riskScore}
                  </div>
                  <p className="text-xs text-slate-400">Risk Score</p>
                </div>
              </div>
              
              {/* Risk Score Bar */}
              <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.riskScore > 70
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : analysis.riskScore > 40
                        ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
              
              <p className="text-xs text-slate-400 pt-1">
                Scanned at {new Date(analysis.timestamp || Date.now()).toLocaleTimeString([], { 
                  hour: "2-digit", 
                  minute: "2-digit" 
                })}
              </p>
            </div>

            {/* Findings */}
            {analysis.findings && analysis.findings.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Security Findings ({analysis.findings.length})
                </h3>
                <div className="space-y-2">
                  {analysis.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/40 border border-slate-700/40 rounded-lg overflow-hidden transition-all duration-300 hover:border-slate-600/60"
                    >
                      <button
                        onClick={() => setExpandedFinding(expandedFinding === idx ? null : idx)}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getSeverityColor(finding.severity)}`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-100 truncate">
                              {finding.type}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                              {finding.severity.toLowerCase()} severity
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                            expandedFinding === idx ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {expandedFinding === idx && (
                        <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700/30 space-y-2 text-xs text-slate-300">
                          <div>
                            <p className="text-slate-400 mb-1 text-xs font-medium">Issue</p>
                            <p className="leading-relaxed">{finding.explanation}</p>
                          </div>
                          <div>
                            <p className="text-cyan-400 mb-1 text-xs font-medium">Recommendation</p>
                            <p className="flex items-start gap-2 leading-relaxed">
                              <span className="text-cyan-400 flex-shrink-0">→</span>
                              <span>{finding.recommendation}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-lg p-6 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-medium text-emerald-200">All Clear</p>
                <p className="text-xs text-slate-400">No security issues detected</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleScan}
                className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Scan Again
              </button>
              <button 
                onClick={() => chrome.tabs.create({ url: 'https://clicksafe.ai/docs' })}
                className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm text-center">
        <p className="text-xs text-slate-500">
          ClickSafe AI © 2025 • Powered by Advanced Threat Detection
        </p>
      </div>
    </div>
  )
}