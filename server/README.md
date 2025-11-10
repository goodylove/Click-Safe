
---

# 🛡️ ClickSafe AI — Email Security Server (Mastra Backend)

**ClickSafe** is a cybersecurity to detect phishing, scam, and malicious emails — with a particular focus on **FinTech**, **Healthcare**, and **Crypto** domains.

This server is powered by **Mastra AI**, providing automated phishing detection, content analysis, and sender credibility scoring using a structured AI-driven framework.

---

## 🚀 Overview

The **ClickSafe Server** runs the backend logic of the Mastra AI security system.
It receives raw email data (sender, content, and links), performs multi-layered security analysis, and returns a detailed, structured JSON security report.

**Core Objectives:**

* Prevent financial and identity theft through AI-powered email analysis
* Detect phishing in emails targeting **banks, healthcare providers, and crypto platforms**
* Provide actionable, human-readable risk reports
* Serve results quickly through a secure REST API




---

## 🧩 Key Features

* **🔗 Link Security Analysis:**
  Detects malicious URLs, typosquatting, shorteners, and fake HTTPS usage.

* **👤 Sender Credibility Assessment:**
  Verifies sender authenticity, domain trust, and identity consistency.

* **📝 Content Pattern Detection:**
  Flags phishing keywords, fake rewards, and threat-based urgency language.

* **💡 Context-Aware Risk Reports:**
  Specially tuned for FinTech, Health, and Crypto-related phishing tactics.

* **⚙️ Structured JSON Output:**
  Returns machine-parseable analysis results for easy frontend integration.

---

## 🧪 Example API Output

```json
{
  "success": true,
  "analysis": {
    "overallRisk": "HIGH",
    "safeToClick": false,
    "confidence": "HIGH",
    "summary": "🚨 DANGER: This is a phishing scam...",
    "recommendations": [
      {
        "priority": "CRITICAL",
        "message": "This email is a phishing attempt...",
        "action": "DELETE_EMAIL",
        "icon": "🚨"
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

```

---

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/clicksafe-ai-server.git
cd server
```

### 2. Install Dependencies

```bash
npm install
```

*or*

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file:

```bash
WHOIS_API_KEY= ffeb4533c73346921cff9f4308d073a3c5be1a2516683c0c9637fea886adc17c
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyBZpyEJi91hB7V35WjzsdwTBZ-Zbd6Lh8A
```

### 4. Start Development Server

```bash
npm run dev
```

If `tsx` isn’t recognized, install it:

```bash
npm install -g tsx
```
---

## 🧠 How It Works

1. **Email Data Input:**
   The backend receives JSON with links, sender info, and email text.

2. **AI Analysis:**
   Mastra AI runs link, sender, and content checks simultaneously.

3. **Risk Evaluation:**
   Scores are combined to determine LOW / MEDIUM / HIGH overall risk.

4. **Response Output:**
   The result is returned as a single, standardized JSON object.

---

## 🧰 API Endpoints

| Method | Endpoint             | Description                                         |
| ------ | -------------------- | --------------------------------------------------- |
| `POST` | `/analyze-email` | Analyze email content and return AI security report |
| `GET`  | `/health`        | Check server health                                 |


---

## 🔒 Security Notes

* Never click links analyzed as **DANGEROUS** or from **new/suspicious domains**.
* All Mastra analyses are run securely and locally; no raw user emails are stored.
* FinTech and Crypto-related patterns are prioritized for higher accuracy.




---

