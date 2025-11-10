Perfect — so now you want a **main project README** that gives an overview of the **entire ClickSafe ecosystem** (Chrome Extension + 
---

# 🛡️ ClickSafe AI — Phishing Detection Ecosystem

**ClickSafe AI** is a full-stack cybersecurity solution that detects phishing, scam, and malicious emails — especially in **FinTech**, **Healthcare**, and **Crypto** domains.

It combines three main components working seamlessly together:

1. 🧠 **Mastra AI Server** — the intelligent backend that performs deep email risk analysis.
2. 🌐 **Client App (Vite + React)** — the user-facing dashboard for viewing and managing analyses.
3. 🧩 **Chrome Extension** — real-time phishing protection while browsing or checking emails.

---

## 🚀 Overview

ClickSafe empowers users to stay protected from phishing attacks, fake financial alerts, crypto scams, and deceptive health service emails.

It uses advanced AI models via **Mastra AI** to analyze:

* Links (URL structure, HTTPS, domain trust, and patterns)
* Sender authenticity (domain age, impersonation attempts)
* Content behavior (urgency, threats, fake authority, rewards)

All results are returned in structured JSON and visualized in an interactive UI.

---

## 🧠 Architecture

```bash
safe-click/
│
├── client/         
│
└── server/         
```

**Workflow:**

1. The **Chrome Extension** captures email  data.
2. It sends data to the **Mastra AI Server** for deep risk analysis.
3. The **Server** responds with structured JSON results.
4. The **Client App**  displays visual reports, risk scores, and recommendations.

---

## 🧩 Components Breakdown

### 🧠 1. Mastra AI Server (Backend)

* Node.js + TypeScript 
* Integrates with **Mastra AI** for intelligent phishing detection
* Performs:

  * Link Safety Analysis
  * Sender Credibility Assessment
  * Content Pattern Detection
* Returns a structured JSON risk report

👉 [View Server README](./server/README.md) for setup details.

---

### 🌐 2. Client App (Frontend)

* Built with **Vite + React + Tailwind CSS**
* Provides a clean dashboard interface (Coming soon)
* Displays AI-generated phishing reports
* Users can:

  * Upload or paste emails for scanning
  * View risk levels and explanations
  * See history of previous analyses

---

### 🧩 3. Chrome Extension

* Monitors Gmail interfaces in real time
* Extracts suspicious links and email previews
* Sends them to the Mastra AI server for instant evaluation
* Displays immediate feedback:

  * 🔴 Dangerous (phishing detected)
  * 🟡 Suspicious (verify sender)
  * 🟢 Safe (no risk detected)

---

## ⚙️ Tech Stack

| Layer              | Tech                               |
| ------------------ | ---------------------------------- |
| **Frontend**       | React, Vite, Tailwind CSS          |
| **Extension**      | Manifest V3, JavaScript/TypeScript |
| **Backend**        | Node.js, TypeScript                | 
| **AI Integration** | Mastra AI                          |
| **Deployment**     | Mastra AI  Cloud                   |

---

## 🧪 Example Flow

1. User receives an email claiming to be from *PayPal Security*
2. Chrome Extension or Client App sends the email content to the **Server**
3. The Server runs full AI analysis
4. Server responds:

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

5. Client displays visual warning + recommendations.

---

## 🧰 Developer Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/goodylove/Safe-click.git
cd safe-click
```

### 2️⃣ Setup the Server

```bash
cd server
npm install
npm run dev
```

### 3️⃣ Setup the Client

```bash
cd client
npm install
npm run dev
```

### 4️⃣ Load Chrome Extension

* Go to `chrome://extensions`
* Enable **Developer Mode**
* Click **“Load unpacked”**
* Select the `/extension` folder 

---

## 🔒 Security Focus Areas

* Detects **FinTech** scams (banks, PayPal, crypto wallets)
* Identifies **Healthcare** impersonations (fake clinics, insurance notices)
* Analyzes **Crypto phishing** (wallet drainers, fake airdrops)
* Prioritizes link safety and sender verification

---

## 🧑‍💻 Team & Credits

**Project:** ClickSafe AI — Hackathon 2025
**AI Framework:** Mastra AI
**Focus Areas:** FinTech • Health • Crypto

---

## 🏁 License

MIT License — for hackathon and educational purposes only.

---


