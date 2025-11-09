chrome.runtime.onInstalled.addListener(() => {
  console.log('ClickSafe AI Phishing Detector installed');
});

// Optional: Listen for auto-scan from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'EMAIL_SCANNED') {
    // Forward to popup if open
    chrome.runtime.sendMessage(msg).catch(() => {});
  }
});