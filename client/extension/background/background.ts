/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log('ClickSafe AI Phishing Detector installed');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'EMAIL_SCANNED') {
    chrome.runtime.sendMessage(msg).catch(() => {});
  }

  if (msg.type === 'CONTENT_SCRIPT_REJECTED') {
    console.warn('Content script rejected:', msg.reason);
    chrome.storage.local.set({ lastError: msg.reason });
  }

  if (msg.type === 'CONTENT_SCRIPT_READY') {
    console.log('Content script ready:', msg.context);
  }
});