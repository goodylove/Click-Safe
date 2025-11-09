import { createTool } from '@mastra/core';
import { w as whois } from '../config.mjs';
import z from 'zod';
import 'dotenv';
import '@whoisjson/whoisjson';

async function getDomainInfo(domain) {
  try {
    const domainParts = domain.split(".");
    const mainDomain = domainParts.slice(-2).join(".");
    const whoisInfo = await whois.lookup(mainDomain);
    let ageDays = null;
    let creationDate = null;
    if (whoisInfo.created) {
      creationDate = whoisInfo.created;
      const created = new Date(creationDate);
      if (!isNaN(created.getTime())) {
        ageDays = Math.floor(
          (Date.now() - created.getTime()) / (1e3 * 60 * 60 * 24)
        );
      }
    }
    return {
      domain: mainDomain,
      registrar: whoisInfo.registrar || "Unknown",
      creationDate,
      ageDays,
      ageCategory: getAgeCategory(ageDays),
      expires: whoisInfo.expires || null,
      updated: whoisInfo.changed || null,
      nameServers: whoisInfo.nameserver || []
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "something went wrong";
    console.error("Domain lookup error for", domain, message);
    return null;
  }
}
function getAgeCategory(ageDays) {
  if (ageDays === null) return "unknown";
  if (ageDays < 30) return "very_new";
  if (ageDays < 90) return "new";
  if (ageDays < 365) return "recent";
  if (ageDays < 1825) return "established";
  return "very_established";
}
async function analyzeDomainReputation(domain) {
  const riskFactors = [];
  let reputationScore = 100;
  const suspiciousPatterns = [
    /([0-9]{1,3}\.){3}[0-9]{1,3}/,
    // IP addresses
    /.*login.*\.(tk|ml|ga|cf)/,
    // Free domains with login
    /.*verify.*\.(xyz|top)/,
    // Suspicious TLDs
    /.*bank.*\.(com|net)/,
    // Brand impersonation
    /.*security.*\.(ru|cn)/
    // Suspicious country codes
  ];
  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(domain.toLowerCase())) {
      riskFactors.push("suspicious_domain_pattern");
      reputationScore -= 20;
    }
  });
  const domainInfo = await getDomainInfo(domain);
  if (domainInfo) {
    if (domainInfo.ageDays !== null) {
      if (domainInfo.ageDays < 30) {
        riskFactors.push("very_new_domain");
        reputationScore -= 25;
      } else if (domainInfo.ageDays < 90) {
        riskFactors.push("new_domain");
        reputationScore -= 15;
      } else if (domainInfo.ageDays < 365) {
        riskFactors.push("recent_domain");
        reputationScore -= 5;
      }
    }
  } else {
    riskFactors.push("whois_lookup_failed");
    reputationScore -= 10;
  }
  return {
    reputationScore: Math.max(0, reputationScore),
    riskFactors,
    trustLevel: reputationScore >= 80 ? "HIGH" : reputationScore >= 60 ? "MEDIUM" : "LOW",
    domainInfo: domainInfo || { error: "WHOIS lookup failed" }
  };
}
function analyzeUrlSafety(url) {
  const riskFactors = [];
  let safetyScore = 100;
  if (!url.startsWith("https://")) {
    riskFactors.push("non_https");
    safetyScore -= 30;
  }
  const suspiciousKeywords = [
    "login",
    "verify",
    "secure",
    "account",
    "password",
    "confirm",
    "validation",
    "auth",
    "signin"
  ];
  suspiciousKeywords.forEach((keyword) => {
    if (url.toLowerCase().includes(keyword)) {
      riskFactors.push(`suspicious_keyword_${keyword}`);
      safetyScore -= 10;
    }
  });
  const shorteners = [
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "adf.ly",
    "shorte.st"
  ];
  if (shorteners.some((shortener) => url.includes(shortener))) {
    riskFactors.push("url_shortener");
    safetyScore -= 25;
  }
  return {
    safetyScore: Math.max(0, safetyScore),
    riskFactors,
    safetyLevel: safetyScore >= 80 ? "SAFE" : safetyScore >= 60 ? "CAUTION" : "DANGEROUS"
  };
}
function analyzeContentHeuristics(content) {
  const phishingIndicators = {
    urgency: [
      "urgent",
      "immediately",
      "right away",
      "asap",
      "within 24 hours",
      "account suspension",
      "verify now",
      "action required"
    ],
    threats: [
      "suspend",
      "close",
      "terminate",
      "locked",
      "restricted",
      "compromised",
      "hacked",
      "security alert"
    ],
    rewards: [
      "free",
      "winner",
      "prize",
      "reward",
      "bonus",
      "limited time",
      "exclusive",
      "special offer"
    ],
    authority: [
      "security team",
      "admin",
      "support",
      "customer service",
      "technical department",
      "billing department"
    ]
  };
  const detectedPatterns = {
    urgency: [],
    threats: [],
    rewards: [],
    authority: []
  };
  let heuristicScore = 100;
  Object.keys(phishingIndicators).forEach((category) => {
    const matches = phishingIndicators[category].filter(
      (indicator) => content.toLowerCase().includes(indicator.toLowerCase())
    );
    if (matches.length > 0) {
      detectedPatterns[category] = matches;
      heuristicScore -= matches.length * 5;
    }
  });
  return {
    heuristicScore: Math.max(0, heuristicScore),
    detectedPatterns,
    riskLevel: heuristicScore >= 80 ? "LOW" : heuristicScore >= 60 ? "MEDIUM" : "HIGH"
  };
}
async function analyzeSender(sender) {
  const riskFactors = [];
  let senderScore = 100;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sender.email)) {
    riskFactors.push("invalid_email_format");
    senderScore -= 20;
  }
  if (sender.name && sender.email) {
    const domainFromEmail = sender.email.split("@")[1];
    const nameWords = sender.name.toLowerCase().split(/\s+/);
    if (nameWords.some((word) => domainFromEmail.includes(word))) {
      riskFactors.push("name_domain_mismatch");
      senderScore -= 15;
    }
  }
  const domainAnalysis = await analyzeDomainReputation(sender.domain);
  senderScore += domainAnalysis.reputationScore - 100;
  riskFactors.push(...domainAnalysis.riskFactors);
  return {
    senderScore: Math.max(0, senderScore),
    riskFactors,
    trustworthiness: senderScore >= 80 ? "TRUSTED" : senderScore >= 60 ? "NEUTRAL" : "SUSPICIOUS"
  };
}
async function analysisTools(emailData) {
  console.log("\u{1F4E7} Email content:", emailData.content);
  const analysis = {
    links: [],
    sender: {},
    content: {}
  };
  if (emailData.links && emailData.links.length > 0) {
    analysis.links = await Promise.all(
      emailData.links.map(async (link) => {
        return {
          ...link,
          safetyAnalysis: analyzeUrlSafety(link.href),
          domainAnalysis: await analyzeDomainReputation(new URL(link.href).hostname)
        };
      })
    );
  }
  if (emailData.metadata && emailData.metadata.sender) {
    analysis.sender = await analyzeSender(emailData.metadata.sender);
  }
  if (emailData.content) {
    analysis.content = analyzeContentHeuristics(emailData.content);
  }
  return analysis;
}
const analysisTool = createTool({
  id: "click-safe",
  description: "Comprehensive email security analysis for phishing detection and link safety assessment",
  inputSchema: z.object({
    type: z.enum(["GMAIL_EMAIL", "OUTLOOK_EMAIL", "WEB_CONTENT", "HEURISTIC_CONTENT", "FALLBACK_CONTENT"]),
    content: z.string(),
    html: z.string().optional(),
    links: z.array(z.object({
      text: z.string(),
      href: z.string(),
      title: z.string().optional(),
      isSuspicious: z.boolean().optional(),
      riskFactors: z.array(z.string()).optional()
    })),
    metadata: z.object({
      sender: z.object({
        name: z.string(),
        email: z.string(),
        domain: z.string()
      }),
      subject: z.string()
    }).optional(),
    url: z.string().optional(),
    source: z.string().optional()
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    console.log("\u{1F50D} Direct email content:", context.content);
    return await analysisTools(context);
  }
});

export { analysisTool };
