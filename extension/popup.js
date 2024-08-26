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
    if(result.token === null || result.validator === null || result.token === undefined || result.validator === undefined){
      showLoginWindow()
    }else{
      showTrackingWindow()
    }
  });
  
};

function createElement(tag, text, parent) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function showTrackingWindow(){
  chrome.storage.local.get('tracking', function(result) {
    console.log(result.tracking)
    // document.getElementById("content").textContent = "Tracking data in "+result.tracking['url'];
    const contentDiv = document.getElementById("content");

    // Apply styles to contentDiv
    contentDiv.style.fontFamily = "Arial, sans-serif";
    contentDiv.style.margin = "20px";
    contentDiv.style.padding = "20px";
    contentDiv.style.borderRadius = "8px";
    contentDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    contentDiv.style.backgroundColor = "#f9f9f9";
    contentDiv.style.maxWidth = "600px";

    createElement('h2', 'Tracking Information', contentDiv).style.color = "#333";

    const titleElement = createElement('p', 'Title: ', contentDiv);
    createElement('strong', result.tracking['title'], titleElement);

    const urlElement = createElement('p', 'URL: ', contentDiv);
    const urlLink = createElement('a', result.tracking['url'], urlElement);
    urlLink.href = result.tracking['url'];
    urlLink.target = "_blank";
    urlLink.style.color = "#007BFF";
    urlLink.style.textDecoration = "none";

    const faviconElement = createElement('p', 'Has Favicon: ', contentDiv);
    createElement('strong', result.tracking['favicon'] ? 'Yes' : 'No', faviconElement);

    const copyrightElement = createElement('p', 'Has Copyright Info: ', contentDiv);
    createElement('strong', result.tracking['has_copyright_info'] ? 'Yes' : 'No', copyrightElement);

    const descriptionElement = createElement('p', 'Has Description: ', contentDiv);
    createElement('strong', result.tracking['has_description'] ? 'Yes' : 'No', descriptionElement);

    const socialMediaElement = createElement('p', 'Has Social Media Links: ', contentDiv);
    createElement('strong', result.tracking['has_social_media_links'] ? 'Yes' : 'No', socialMediaElement);

    const selfRefElement = createElement('p', 'Number of Self References: ', contentDiv);
    createElement('strong', result.tracking['no_of_self_ref'], selfRefElement);
  })
}

function getInputField(id, labelText, placeholderText = "", helperText = "") {
  // Create label
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;
  label.style.fontSize = "14px";
  label.style.color = "#333";
  label.style.display = "block";
  label.style.marginBottom = "5px";

  // Create input
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", id);
  input.setAttribute("placeholder", placeholderText);
  input.style.width = "100%";
  input.style.padding = "10px";
  input.style.borderRadius = "4px";
  input.style.border = "1px solid #ccc";
  input.style.boxSizing = "border-box";
  input.style.fontSize = "14px";
  input.style.marginBottom = "10px";

  // Create helper text (if provided)
  const helper = document.createElement("small");
  helper.textContent = helperText;
  helper.style.fontSize = "12px";
  helper.style.color = "#666";
  helper.style.display = "block";
  helper.style.marginTop = "-8px";
  helper.style.marginBottom = "15px";

  return [label, input, helper];
}

function showLoginWindow(){
  const div = document.createElement("div");
  div.classList.add("input-container");
  
  // Apply styles to the container
  div.style.margin = "20px";
  div.style.padding = "20px";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  div.style.backgroundColor = "#f9f9f9";
  div.style.maxWidth = "400px";
  div.style.fontFamily = "Arial, sans-serif";
  div.style.textAlign = "center"; // Center the content
  
  // Dynamically create the "Token" input field with a label and helper text
  const tokenField = getInputField("token-input", "Token:", "Enter your token", "Your unique token for access");
  div.appendChild(tokenField[0]);
  div.appendChild(tokenField[1]);
  div.appendChild(tokenField[2]);
  
  // Create and style the Submit button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.style.padding = "10px 20px";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "4px";
  submitButton.style.backgroundColor = "#007BFF";
  submitButton.style.color = "#fff";
  submitButton.style.fontSize = "14px";
  submitButton.style.cursor = "pointer";
  submitButton.style.marginTop = "10px";
  
  submitButton.addEventListener("click", getValidatorToken);
  // Append the Submit button to the container
  div.appendChild(submitButton);
  
  // Append the container div to the content section
  document.getElementById("content").appendChild(div);
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
        document.getElementById("content").innerHTML = ``
        showTrackingWindow()
      });
    })
    .catch(error => {
      console.error(error.message); // Log any errors that occur
    });
}