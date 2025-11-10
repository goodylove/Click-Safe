
#  ClickSafe AI — Phishing Detection Chrome Extension (Frontend)

ClickSafe AI is a **browser-based email security extension** that uses **AI-powered threat analysis** to detect phishing, scams, and suspicious links directly within **Gmail, Outlook, and other email platforms**.

This frontend module is built with **React + TypeScript + Vite**, and serves as the **popup interface** for scanning, displaying results, and managing scan history.

---

##  Overview

Phishing remains one of the most common attack vectors in personal and corporate email. ClickSafe AI integrates directly into the browser, scanning email content in real-time and evaluating potential threats using a machine-learning API.

Users can:

*  **Scan any email** on Gmail or Outlook instantly.
*  **View AI-driven analysis** of sender behavior, links, and message structure.
* **Get severity-based alerts** (Safe, Suspicious, or Malicious).
*  **Store past scan results** for offline review.
* **Access settings and history** via the popup UI.

---

##  Tech Stack

| Layer               | Technology                                        |
| ------------------- | ------------------------------------------------- |
| Framework           | React (Vite + TypeScript)                         |
| Styling             | TailwindCSS                                       |
| Icons               | Lucide React                                      |
| API Communication   | Fetch API                                         |
| Browser Environment | Chrome Extension APIs (Manifest V3)               |
| Backend             | ClickSafe AI Threat Analysis API (Cloud Function) |

---

##  Folder Structure

```
clicksafe-frontend/
├── src/
│   ├── Popup.tsx             # Main popup UI (React)
│   ├── background.ts         # Chrome background service
│   ├── content.ts            # Injected script for reading email content
│   ├── assets/               # Images, logos, icons
│   ├── styles/               # Tailwind and base styles
│   ├── pages/                # Settings & history pages
│   ├── utils/                # Helper functions
│   ├── manifest.json         # Chrome extension manifest
│   └── vite.config.ts        # Vite build configuration
└── dist/                     # Production build output
```

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/clicksafe-frontend.git
cd clicksafe-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally (Development Mode)

```bash
npm run dev
```

Vite will start a dev server, usually at:

```
http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
```

This creates a production-ready build in the `dist/` folder.

---

## 🧠 Loading the Extension in Chrome

1. Open **Google Chrome** and navigate to:

   ```
   chrome://extensions
   ```
2. Enable **Developer Mode** (top-right corner).
3. Click **“Load unpacked”**.
4. Select the `dist/` folder generated after the build.
5. You’ll see **ClickSafe AI** appear in your extensions list.

---

## How It Works

| Step               | Description                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| 1 **Detection**  | The content script (`content.ts`) safely reads visible text from supported pages (Gmail, Outlook, Yahoo Mail). |
| 2️ **Extraction** | It collects sender, subject, message body, and URLs — cleaning unwanted HTML, scripts, and hidden elements.    |
| 3️ **Analysis**   | The payload is sent securely to the backend API (`/analyze-email`), which returns a full risk assessment.      |
| 4️ **Display**    | The popup renders the verdict (Safe / Suspicious / Malicious), confidence score, and recommendations.          |
| 5️ **Storage**    | Scan results are cached locally using `chrome.storage.local` for offline history.                              |

---

## Popup UI Features

* **Scan Button:** Triggers content extraction and sends data to backend.
* **Loading Animation:** Displays progress while analysis runs.
* **Results View:** Displays color-coded verdict, risk score bar, and individual findings.
* **Expandable Findings:** Users can view details and recommendations for each detected issue.
* **History Page:** View and revisit previous scan results.
* **Settings Page:** Manage preferences and extension configurations.

---

##  Supported Pages

Gmail (`mail.google.com`)
Outlook (`outlook.live.com`, `outlook.office.com`)
Yahoo Mail (`mail.yahoo.com`)
 Generic webmail and text-based pages (partial support)

---

##  API Integration

The frontend communicates with a backend endpoint:

```
POST https://wailing-young-van.mastra.cloud/analyze-email
```

**Request Body:**

```json
{
  "content": { "type": "GMAIL_EMAIL", "content": "...", "metadata": {...} },
  "url": "https://mail.google.com/...",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Response Example:**

```json
{
  "riskScore": 72,
  "verdict": "SUSPICIOUS",
  "confidence": 94,
  "findings": [
    {
      "type": "Suspicious URL",
      "severity": "HIGH",
      "explanation": "The email contains an HTTP link to an IP address.",
      "recommendation": "Avoid clicking links that use direct IPs or non-HTTPS."
    }
  ]
}
```

---

## Development Notes

* React entry file: `Popup.tsx`
* Extension entry points: `background.ts`, `content.ts`
* All pages are bundled by Vite with ES modules.
* Tailwind is configured in `tailwind.config.js` for consistent styling.
* The build output automatically places compiled assets in `/dist/assets`.

---

## 🧪 Testing the Extension

1. Build and load the unpacked extension.
2. Open Gmail or Outlook.
3. Open an email and click the **ClickSafe AI icon** in your toolbar.
4. Click **Scan Mail**.
5. Wait for results — risk score, findings, and recommendations appear instantly.

---

## 🛠️ Common Issues

| Issue                           | Fix                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| **Cannot access page content**  | Make sure you’re on Gmail, Outlook, or a supported page.                           |
| **Backend error: 400/500**      | Ensure the backend API endpoint is reachable and CORS-enabled.                     |
| **Icons or images not showing** | Check your `vite.config.ts` public path and confirm assets are in `/dist/assets/`. |
| **Popup not loading**           | Verify that your script paths in `popup.html` match the `dist` structure.          |

---

## 🏅 Hackathon Highlights

| Feature                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| **AI-Powered Security** | Uses machine learning to classify threats and phishing patterns. |
| **Zero Trust Design**   | Runs client-side analysis before server calls.                   |
| **Privacy-Focused**     | No user data is stored or transmitted without consent.           |
| **Cross-Platform**      | Works across major webmail providers.                            |
| **Real-Time Feedback**  | Displays instant verdicts and recommendations.                   |

---

## 🤝 Contributing

We welcome contributions!
Fork the repo, create a feature branch, and submit a pull request.

```bash
git checkout -b ft-#123-new-feature
git commit -m "ft-#123: add scanning animation"
git push origin ft-#123-new-feature
```

---

##  License

MIT License © 2025 [ClickSafe AI Team]
Built with  for the Hackathon community.

---

