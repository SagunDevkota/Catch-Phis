let redirectCounter = {};

chrome.webRequest.onBeforeRedirect.addListener(details => {

  // Get current tab id
  const {tabId} = details;

  // Read current count, increment and update
  const prevCount = redirectCounter[tabId] || 0;
  redirectCounter[tabId] = prevCount + 1;

}, {urls: ["<all_urls>"]});

chrome.tabs.onUpdated.addListener((tabId, changedInfo, tab) => {
    if (changedInfo.status === "complete" && tab.url) {
      const count = redirectCounter[tabId] || 0;
      chrome.tabs.sendMessage(tabId, {
        greeting: "NEW",
        count:count
      });
      redirectCounter[tabId] = 0;
    }
  })

  