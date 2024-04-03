let redirectCounter = {};
let originalUrls = {};

chrome.webRequest.onBeforeRedirect.addListener(details => {

  // Get current tab id
  const {tabId, url} = details;
  // Read current count, increment and update
  const prevCount = redirectCounter[tabId] || 0;
  if(prevCount == 0){
    originalUrls[tabId] = url;
  }
  redirectCounter[tabId] = prevCount + 1;

}, {urls: ["<all_urls>"]});

chrome.tabs.onUpdated.addListener((tabId, changedInfo, tab) => {
    if (changedInfo.status === "complete" && tab.url) {
      const count = redirectCounter[tabId] || 0;
      const url = originalUrls[tabId] || ''
      chrome.tabs.sendMessage(tabId, {
        greeting: "NEW",
        count:count,
        url:url
      });
      redirectCounter[tabId] = 0;
    }
  })

  