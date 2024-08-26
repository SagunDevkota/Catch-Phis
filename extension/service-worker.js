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

  

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Perform the fetch request from the background script
    chrome.storage.local.get(['token', 'validator'], (result) => {
      fetch(request.url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "token":result.token,
              "validator":result.validator
          },
          body: JSON.stringify(request.data)
      })
      .then(response => {
        if(response.status == 403){
          chrome.storage.local.set({ token: null,validator: null })
        }
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => sendResponse({ success: true, data }))
      .catch(error => {
          console.error('Error:', error);
          sendResponse({ success: false, error: error.message });
      });
    });

    // Return true to indicate that the response is asynchronous
    return true;
});
