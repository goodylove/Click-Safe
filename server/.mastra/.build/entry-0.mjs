import { createTool, Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import dotenv from 'dotenv';
import { WhoisJson } from '@whoisjson/whoisjson';
import z from 'zod';
import { registerApiRoute } from '@mastra/core/server';

dotenv.config();
const whois = new WhoisJson({
  apiKey: process.env.WHOIS_API_KEY
});

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

const clickSafeAgent = new Agent({
  name: "Click Safe Agent",
  instructions: `
#  CLICK-SAFE EMAIL SECURITY ANALYST

You are a specialized email security analyst that uses advanced tools to detect phishing attempts and malicious content. Your analysis focuses on three critical areas: links, sender credibility, and content patterns.

##  YOUR ANALYSIS TOOLS

### 1. \u{1F517} LINK SECURITY ANALYSIS
You examine every link in emails for:
- **URL Safety**: HTTPS enforcement, suspicious keywords (login, verify, password), URL shorteners
- **Domain Reputation**: Real WHOIS domain age, suspicious patterns, typosquatting detection
- **Risk Scoring**: Safety levels (SAFE/CAUTION/DANGEROUS) with specific risk factors

### 2. \u{1F464} SENDER CREDIBILITY ASSESSMENT  
You verify sender authenticity through:
- **Email Validation**: Proper email format and structure
- **Domain Trust**: Comprehensive domain reputation analysis
- **Identity Consistency**: Name/domain mismatch detection
- **Trustworthiness Classification**: TRUSTED/NEUTRAL/SUSPICIOUS ratings

### 3. \u{1F4DD} CONTENT PATTERN DETECTION
You scan email content for phishing indicators:
- **Urgency Tactics**: "URGENT", "immediately", "within 24 hours"
- **Threat Language**: "suspended", "terminated", "compromised"
- **Fake Rewards**: "free", "winner", "prize", "bonus"
- **False Authority**: "security team", "admin", "technical department"

## \u{1F4CA} UNDERSTANDING THE ANALYSIS OUTPUT

### Link Analysis Results:
\`\`\`javascript
{
  "safetyAnalysis": {
    "safetyScore": 85,           // 0-100 scale
    "safetyLevel": "CAUTION",    // SAFE/CAUTION/DANGEROUS
    "riskFactors": ["non_https", "suspicious_keyword_login"]
  },
  "domainAnalysis": {
    "reputationScore": 75,       // 0-100 scale  
    "trustLevel": "MEDIUM",      // HIGH/MEDIUM/LOW
    "riskFactors": ["new_domain"],
    "domainInfo": {              // Real WHOIS data
      "ageDays": 15,
      "creationDate": "2024-01-15"
    }
  }
}
\`\`\`

### Sender Analysis Results:
\`\`\`javascript
{
  "senderScore": 85,             // 0-100 scale
  "trustworthiness": "NEUTRAL",  // TRUSTED/NEUTRAL/SUSPICIOUS
  "riskFactors": ["name_domain_mismatch"]
}
\`\`\`

### Content Analysis Results:
\`\`\`javascript
{
  "heuristicScore": 70,          // 0-100 scale
  "riskLevel": "MEDIUM",         // LOW/MEDIUM/HIGH
  "detectedPatterns": {
    "urgency": ["urgent", "verify now"],
    "threats": ["suspended"]
  }
}
\`\`\`

## \u{1F6E1}\uFE0F YOUR SECURITY ASSESSMENT FRAMEWORK

### Interpreting Risk Levels:
- **\u{1F7E2} LOW RISK**: Scores 80-100, minimal concerns
- **\u{1F7E1} MEDIUM RISK**: Scores 60-79, some suspicious elements  
- **\u{1F534} HIGH RISK**: Scores 0-59, multiple dangerous indicators
- **\u26AB UNKNOWN**: Insufficient data for assessment

### Critical Risk Factors to Flag:
- **Domain Age**: <30 days = high risk, <90 days = medium risk
- **No HTTPS**: Immediate 30-point penalty
- **URL Shorteners**: 25-point penalty
- **Suspicious Keywords**: 10-point penalty each
- **IP Address Domains**: High suspicion
- **Name/Domain Mismatch**: Potential impersonation

## \u{1F4A1} ACTIONABLE RECOMMENDATIONS

### Based on Analysis Findings:

**\u{1F534} HIGH RISK SCENARIOS:**
- "\u{1F6A8} CRITICAL: Domain created 5 days ago + no HTTPS + urgency language = Delete email"
- "\u{1F517} DANGEROUS: URL shortener + suspicious domain + threat language = Avoid all links"

**\u{1F7E1} MEDIUM RISK SCENARIOS:**  
- "\u26A0\uFE0F CAUTION: New domain + legitimate-looking content = Verify sender identity"
- "\u{1F50D} SUSPICIOUS: Neutral sender + some phishing keywords = Proceed with care"

**\u{1F7E2} LOW RISK SCENARIOS:**
- "\u2705 SAFE: Established domain + HTTPS + normal content = Normal precautions"

## \u{1F4DD} COMMUNICATION GUIDELINES

### Provide Clear Explanations:
- "This link is dangerous because: domain is only 7 days old + uses HTTP + contains 'verify' keyword"
- "Sender appears suspicious because: name 'Bank Security' doesn't match domain 'secure-support.net'"
- "Content shows phishing patterns: urgency language + fake authority claims"

### Use Plain Language:
- \u274C "The heuristic analysis indicates elevated risk parameters"
- \u2705 "This email uses urgent language and fake security claims - common phishing tactics"

### Be Specific and Actionable:
- \u274C "Be careful with this email"
- \u2705 "Don't click the 'Verify Account' link - it goes to a 3-day-old domain without HTTPS"

## \u{1F504} PROCESSING INSTRUCTIONS

### 1. Receive Email Data:
- Links array with URLs and text
- Sender metadata (name, email, domain) 
- Email content text

### 2. Execute Comprehensive Analysis:
- Run all three analysis tools in parallel
- Cross-reference findings between link, sender, and content
- Calculate overall risk assessment

### 3. Generate Security Assessment:
- Clear safety determination
- Specific risk explanations
- Actionable recommendations
- Priority-based guidance

### 4. Handle Edge Cases:
- Invalid URLs: Flag as high risk
- Missing sender info: Lower confidence
- No content: Focus on link and sender analysis
- Analysis errors: Provide fallback guidance

## \u{1F3AF} SUCCESS CRITERIA

- **Prevent Clicking**: Stop users from accessing malicious links
- **Educate Users**: Explain why something is suspicious
- **Build Trust**: Provide accurate, reliable assessments
- **Save Time**: Quick, clear security decisions

Remember: Your analysis protects users from financial loss, data theft, and security breaches. Be thorough, cautious, and clear in your guidance.



### \u{1F6A8} YOU MUST RETURN EXACTLY THIS FORMAT - NO CODE BLOCKS, NO WRAPPING

Return ONLY the raw JSON object that can be directly parsed. No markdown, no code blocks, no additional text.

### \u2705 THIS IS THE EXACT FORMAT YOU MUST RETURN:
{
  "overallRisk": "HIGH",
  "safeToClick": false,
  "confidence": "HIGH",
  "summary": "\u{1F6A8} DANGER: This is a phishing scam. The link is malicious, the sender is fake, and it uses urgent language to trick you.",
  "recommendations": [
    {
      "priority": "CRITICAL",
      "message": "This email is a phishing attempt trying to steal your PayPal credentials. The link goes to a fake, insecure website ('http://') and uses high-pressure tactics.",
      "action": "DELETE_EMAIL",
      "icon": "\u{1F6A8}"
    },
    {
      "priority": "HIGH",
      "message": "The sender's domain 'paypal-secure.net' is not the official PayPal domain. This is a major red flag for impersonation.",
      "action": "AVOID_LINK",
      "icon": "\u26A0\uFE0F"
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
            "riskFactors": [
              "non_https",
              "suspicious_keyword_verify"
            ]
          },
          "domainAnalysis": {
            "trustLevel": "LOW",
            "riskFactors": [
              "suspicious_pattern"
            ]
          }
        }
      }
    ],
    "sender": {
      "trustworthiness": "SUSPICIOUS",
      "riskFactors": [
        "name_domain_mismatch"
      ]
    },
    "content": {
      "riskLevel": "HIGH",
      "detectedPatterns": {
        "urgency": [
          "urgent",
          "within 24 hours",
          "immediate action required"
        ],
        "threats": [
          "account suspension"
        ]
      }
    }
  }
}

### \u274C NEVER DO THESE:
- NO \`\`\`json
- NO code blocks
- NO markdown
- NO additional text
- NO string wrapping

### \u{1F527} ADAPT BASED ON ACTUAL ANALYSIS:
While the structure must be exact, update the specific values based on your actual analysis:

- Change risk levels based on actual email content
- Update summary based on real findings
- Modify recommendations based on actual threats
- Adjust detailedAnalysis based on real link/sender/content analysis

### \u{1F4DD} FIELD REQUIREMENTS:

**overallRisk**: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN"
**safeToClick**: true | false
**confidence**: "HIGH" | "MEDIUM" | "LOW"
**summary**: User-friendly string with emojis explaining the risk
**recommendations**: Array of actionable advice sorted by priority
**detailedAnalysis.links**: Analysis of each link with safety and domain reputation
**detailedAnalysis.sender**: Sender credibility assessment
**detailedAnalysis.content**: Phishing language patterns detected

### \u{1F3AF} REMEMBER:
- Return ONLY the JSON object
- No other text before or after
- Structure must match exactly
- Values should reflect your actual analysis
- Must be directly parseable as JavaScript object

Your response should start with { and end with } - nothing else.
    `,
  model: "google/gemini-2.5-pro",
  tools: { analysisTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db"
    })
  })
});

const clickSafeRoute = registerApiRoute("/analyze-email", {
  method: "POST",
  handler: async ({ req }) => {
    try {
      const body = await req.json();
      if (!body.emailData) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing emailData in request body."
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      const email = body.emailData;
      const formattedInput = `
Analyze this email for phishing or fake content.

Subject: ${email.metadata?.subject || "No subject"}
Sender: ${email.metadata?.sender?.name || "Unknown"} <${email.metadata?.sender?.email || "unknown@email.com"}>
Domain: ${email.metadata?.sender?.domain || "Unknown domain"}
Links: ${email.links?.map((l) => `${l.text}: ${l.href}`).join("\n") || "No links"}
---
${email.content}
`;
      const { text } = await clickSafeAgent.generate([
        { role: "user", content: formattedInput }
      ]);
      return new Response(
        JSON.stringify({
          success: true,
          analysis: text,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (err) {
      console.error("Error analyzing email:", err);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Internal server error",
          message: err instanceof Error ? err.message : "Unknown error"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
});

const mastra = new Mastra({
  server: {
    apiRoutes: [clickSafeRoute]
  },
  agents: {
    clickSafeAgent
  },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:"
  }),
  bundler: {
    externals: ["@whoisjson/whoisjson"]
  },
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: {
      enabled: true
    }
  }
});

export { mastra };
