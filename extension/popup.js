chrome.runtime.onMessage.addListener((message) => {
    console.log(message)
    if (message.popupMessage) {
      // update popup DOM
      document.getElementById("message").innerHTML = message.popupMessage
    }
  });