// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';
// vite.config.ts  →  copy-manifest plugin
const manifest = {
  manifest_version: 3,
  name: "ClickSafe - AI Phishing Detector",
  description: "Detect phishing instantly using AI.",
  version: "1.0.0",
  icons: {
    "16": "icons/icon-16x16.png",
    "48": "icons/favicon.ico",
    "180": "icons/icon-180.png"
  },
  action: {
    default_popup: "extension/popup/popup.html",
    default_icon: {
      "16": "icons/icon-16x16.png",
      "48": "icons/favicon.ico"
    }
  },
  background: {
    service_worker: "background.js"
  },
  content_scripts: [
    {
      matches: [
        "https://mail.google.com/*",
        "https://outlook.office.com/*",
        "https://outlook.live.com/*",
        "https://mail.yahoo.com/*"
      ],
      js: ["content.js"],
      run_at: "document_idle",
      all_frames: false
    }
  ],
  permissions: ["storage", "activeTab", "scripting", "tabs"],
  host_permissions: ["https://wailing-young-van.mastra.cloud/*"],
  web_accessible_resources: [
    {
      resources: ["assets/*", "icons/*", "logo.png"],
      matches: ["<all_urls>"]
    }
  ]
};
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-manifest',
      writeBundle() {
        writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'extension/popup/popup.html'),
        content: resolve(__dirname, 'extension/content/content.ts'),
        background: resolve(__dirname, 'extension/background/background.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'background') return 'background.js';
          return '[name].js'; // popup.js
        },
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});