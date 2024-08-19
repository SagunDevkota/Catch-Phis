// chrome.runtime.onMessage.addListener((message) => {
//     console.log(message)
//     if (message.popupMessage) {
//       document.getElementById("message").innerHTML = message.popupMessage
//     }
//   });
// var trackingData = null
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(request.tracking)
//   document.getElementById("content").textContent = request.tracking
// });
window.onload = function() {
  token = localStorage.getItem("token")
  validator = localStorage.getItem("validator")
  console.log(token===null,validator===null)
  fetch('file.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    // `data` contains the contents of the text file
    base_url = data
    console.log(base_url)
  })
  .catch(error => {
    console.error('Error:', error);
  });

  chrome.storage.local.get(["token", "validator"], function(result) {
    if(result.token === null || result.validator === null){
      showLoginWindow()
    }else{
      showTrackingWindow()
    }
  });
  
};

function showTrackingWindow(){
  chrome.storage.local.get('tracking', function(result) {
    document.getElementById("content").textContent = JSON.stringify(result.tracking);
  })
}

function getInputField(id,text){
  label = document.createElement("label")
  label.setAttribute("for",id)
  label.textContent = text
  input = document.createElement("input")
  input.type = 'text'
  input.setAttribute("id",id)
  submit = document.createElement("input")
  submit.setAttribute("type","submit")
  submit.addEventListener("click", function() {
      getValidatorToken();
  });
  return [label,input,submit]
}

function showLoginWindow(){
  div = document.createElement("div")
  div.classList.add("input-container")
  items = getInputField("token-input","Token: ")
  div.appendChild(items[0])
  div.appendChild(items[1])
  div.appendChild(items[2])
  document.getElementById("content").appendChild(div)
}

function getValidatorToken(){
  const url = base_url+"api/predict/validate-extension-token/";
  const token = document.getElementById("token-input").value; // Get the token value from the input field

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the correct Content-Type header
    },
    body: JSON.stringify({ "token": token }), // Properly format the body as JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(json => {
      chrome.storage.local.set({ token: token,validator: json['validator'] }, function() {
        console.log("Token/Validator is stored.");
      });
    })
    .catch(error => {
      console.error(error.message); // Log any errors that occur
    });
}