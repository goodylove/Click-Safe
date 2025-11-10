
import { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Loader2,
  History,
  Settings,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ScanText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Link2,
  Mail,
  AlertOctagon,
} from "lucide-react";
import { motion } from "framer-motion";

interface Recommendation {
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  message: string;
  action: string;
  icon: string;
}

interface LinkAnalysis {
  text: string;
  href: string;
  analysis: {
    overallRisk: string;
    safetyAnalysis: { safetyLevel: string; riskFactors: string[] };
    domainAnalysis: { trustLevel: string; riskFactors: string[] };
  };
}

interface DetailedAnalysis {
  links: LinkAnalysis[];
  sender: { trustworthiness: string; riskFactors: string[] };
  content: {
    riskLevel: string;
    detectedPatterns: {
      urgency: string[];
      threats: string[];
      authority: string[];
    };
  };
}

interface BackendAnalysis {
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
  safeToClick: boolean;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  recommendations: Recommendation[];
  detailedAnalysis: DetailedAnalysis;
}

interface Analysis {
  riskScore: number;
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  confidence: number;
  summary: string;
  recommendations: Recommendation[];
  links: LinkAnalysis[];
  senderRisks: string[];
  contentPatterns: { urgency: string[]; threats: string[]; authority: string[] };
  timestamp: string;
  safeToClick: boolean;
}

declare const chrome: any;

export default function PopupContent() {
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [expandedRec, setExpandedRec] = useState<number | null>(null);
  const [expandedLink, setExpandedLink] = useState<number | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["scanHistory"], (result: any) => {
      if (Array.isArray(result.scanHistory) && result.scanHistory.length > 0) {
        setHasHistory(true);
      }
    });
  }, []);
  

  const ensureContentScript = async (tabId: number) => {
    return chrome.scripting.executeScript({
      target: { tabId, allFrames: false },
      files: ["content.js"],
    });
  };

  const extractTabContent = async (tabId: number): Promise<any> => {
    const MAX_ATTEMPTS = 20;
    const DELAY_MS = 350;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const response = await new Promise<any>((resolve) => {
        chrome.tabs.sendMessage(
          tabId,
          { action: "SCAN_EMAIL" },
          (resp: any) => resolve(chrome.runtime.lastError ? null : resp)
        );
      });

      if (response?.data) return filterEssentialData(response.data);

      if (chrome.runtime.lastError?.message?.includes("Receiving end does not exist")) {
        await ensureContentScript(tabId);
      }

      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
    throw new Error("Cannot access page content. Make sure you are on Gmail, Outlook, or a supported page.");
  };

  const filterEssentialData = (data: any) => {
    const clean = data.content?.replace(/[͏­]/g, "").replace(/\s+/g, " ").trim() || "";
    const links = (data.links || []).filter(
      (l: any) =>
        l?.href &&
        !l.href.includes("mail.google.com") &&
        !l.href.includes("accounts.google.com") &&
        l.text?.trim()
    );
    return { ...data, content: clean, links };
  };


const sendToBackend = async (content: any): Promise<Analysis> => {
  const res = await fetch("http://localhost:4111/analyze-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailData: content }),
  });

  if (!res.ok) throw new Error(`Backend error: ${res.status}`);

  const raw = await res.json();
  if (!raw.success || !raw.analysis) throw new Error("Invalid backend response");

  let jsonString = raw.analysis as string;
  if (jsonString.startsWith("json\n")) jsonString = jsonString.slice(5);
  jsonString = jsonString.trim();

  let parsed: BackendAnalysis;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.error("JSON parse error – raw string:", jsonString);
    throw new Error("Failed to parse analysis JSON");
  }

  const riskMap = { LOW: "SAFE", MEDIUM: "SUSPICIOUS", HIGH: "MALICIOUS" } as const;
  const confMap = { LOW: 30, MEDIUM: 70, HIGH: 95 } as const;

  return {
    riskScore: confMap[parsed.confidence],
    verdict: riskMap[parsed.overallRisk] as "SAFE" | "SUSPICIOUS" | "MALICIOUS",
    confidence: confMap[parsed.confidence],
    summary: parsed.summary,
    recommendations: parsed.recommendations,
    links: parsed.detailedAnalysis.links,
    senderRisks: parsed.detailedAnalysis.sender.riskFactors,
    contentPatterns: parsed.detailedAnalysis.content.detectedPatterns,
    timestamp: raw.timestamp || new Date().toISOString(),
    safeToClick: parsed.safeToClick,
  };
};
  // ——————————————————— Store History ———————————————————
  const storeResults = (analysis: Analysis) => {
    chrome.storage.local.get(["scanHistory"], (result: any) => {
      const history = result.scanHistory || [];
      history.unshift({ ...analysis, id: Date.now(), url: window.location.href });
      chrome.storage.local.set({ scanHistory: history.slice(0, 50) });
    });
  };

  // ——————————————————— Scan Handler ———————————————————
  const handleScan = async () => {
    setScanning(true);
    setError(null);
    setAnalysis(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab");

      await ensureContentScript(tab.id);
      const content = await extractTabContent(tab.id);
      console.log(content);
      
      const result = await sendToBackend(content);
      console.log(result, 'result');
      
      setAnalysis(result);
      storeResults(result);
    } catch (err: any) {
      setError(err.message || "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "SAFE":
        return { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20" };
      case "SUSPICIOUS":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "shadow-yellow-500/20" };
      case "MALICIOUS":
        return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" };
      default:
        return { bg: "bg-slate-700/20", border: "border-slate-600/50", text: "text-slate-400", glow: "" };
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "CRITICAL": return { color: "text-red-400", bg: "bg-red-500/10", icon: "text-red-400" };
      case "HIGH": return { color: "text-orange-400", bg: "bg-orange-500/10", icon: "text-orange-400" };
      case "MEDIUM": return { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "text-yellow-400" };
      default: return { color: "text-slate-400", bg: "bg-slate-700/10", icon: "text-slate-400" };
    }
  };

  const style = analysis ? getVerdictStyle(analysis.verdict) : getVerdictStyle("");

  return (
    <div className="w-96 h-[600px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <img src="/logo.png" alt="logo" className="h-8" />
          <div className="flex gap-1">
            {hasHistory && (
              <button onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("history.html") })} className="p-2 hover:bg-slate-800/60 rounded-lg text-slate-400 hover:text-slate-200">
                <History className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") })} className="p-2 hover:bg-slate-800/60 rounded-lg text-slate-400 hover:text-slate-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {!analysis && !scanning && !error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
              <p className="text-sm text-slate-300">AI-powered phishing detection. Scan any email in real-time.</p>
              <button onClick={handleScan} className="mt-3 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2">
                <ScanText className="w-5 h-5" /> Scan Mail
              </button>
            </div>
          </motion.div>
        )}

        {scanning && (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <p className="mt-3 text-sm">Analyzing...</p>
          </div>
        )}

        {error && !analysis && (
          <div className="bg-red-950/30 border border-red-700/40 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <p className="text-sm text-red-200 flex-1">{error}</p>
            <button onClick={() => { setError(null); handleScan(); }} className="text-red-400 hover:text-red-300">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-xl border ${analysis.verdict === "MALICIOUS" ? "bg-red-500/10 border-red-500/30" : style.border} ${style.bg} backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3">
                {analysis.verdict === "MALICIOUS" ? <AlertOctagon className="w-6 h-6 text-red-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                <p className={`text-sm font-medium ${analysis.verdict === "MALICIOUS" ? "text-red-300" : "text-slate-300"}`}>
                  {analysis.summary}
                </p>
              </div>
            </motion.div>

            {/* Verdict Card */}
            <motion.div whileHover={{ scale: 1.005 }} className={`p-5 rounded-xl border ${style.border} ${style.bg} ${style.glow} backdrop-blur-xl`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className={style.text}>
                    {analysis.verdict === "SAFE" ? <ShieldCheck className="w-7 h-7" /> :
                     analysis.verdict === "SUSPICIOUS" ? <ShieldAlert className="w-7 h-7" /> :
                     <Shield className="w-7 h-7" />}
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${style.text}`}>{analysis.verdict}</p>
                    <p className="text-xs text-slate-400">Confidence: {analysis.confidence}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{analysis.riskScore}</p>
                  <p className="text-xs text-slate-400">Risk Score</p>
                </div>
              </div>

              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidence}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-linear-to-r from-cyan-500 to-blue-500"
                />
              </div>
            </motion.div>

            {analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Recommendations</h3>
                {analysis.recommendations.map((r, i) => {
                  const ps = getPriorityStyle(r.priority);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-3 rounded-lg border ${ps.bg} border-${ps.color.split("-")[1]}-500/30 backdrop-blur-sm`}
                    >
                      <button
                        onClick={() => setExpandedRec(expandedRec === i ? null : i)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${ps.icon}`}>{r.icon}</span>
                          <span className={`text-sm font-medium ${ps.color}`}>{r.priority}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedRec === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedRec === i && (
                        <div className="mt-2 text-xs text-slate-300 space-y-1">
                          <p>{r.message}</p>
                          <p className="text-cyan-400 font-medium">→ {r.action.replace("_", " ")}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {analysis.links.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Suspicious Links</h3>
                {analysis.links.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-800/40 border border-slate-700/40 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedLink(expandedLink === i ? null : i)}
                      className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <p className="text-xs text-slate-300 truncate">{l.text || l.href}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedLink === i ? "rotate-180" : ""}`} />
                    </button>
                    {expandedLink === i && (
                      <div className="px-3 py-2 bg-slate-900/50 border-t border-slate-700/30 text-xs text-slate-300 space-y-1">
                        <p><strong>URL:</strong> <span className="text-cyan-400 break-all">{l.href}</span></p>
                        <p><strong>Safety:</strong> <span className="text-red-400">{l.analysis.safetyAnalysis.safetyLevel}</span></p>
                        <p className="text-orange-400">
                          Risks: {l.analysis.safetyAnalysis.riskFactors.join(", ")}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {(analysis.senderRisks.length > 0 || Object.values(analysis.contentPatterns).flat().length > 0) && (
              <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-3 text-xs space-y-2">
                {analysis.senderRisks.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail className="w-4 h-4 text-yellow-400" />
                    {analysis.senderRisks.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full">
                        {r.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
                {Object.entries(analysis.contentPatterns).map(([key, vals]) => vals.length > 0 && (
                  <div key={key} className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    {vals.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full">
                        {v}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3">
              <button onClick={handleScan} className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-100 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Scan Again
              </button>
              <button onClick={() => chrome.tabs.create({ url: "https://clicksafe.ai/docs" })} className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-medium shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Docs
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm text-center">
        <p className="text-xs text-slate-500">ClickSafe AI © 2025 • AI Threat Intelligence</p>
      </div>
    </div>
  );
}