// background.js
chrome.runtime.onInstalled.addListener(() => {
    // Set default reading speed
    chrome.storage.sync.set({ wpm: 200 });
  });