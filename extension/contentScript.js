chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  console.log(message)
  if (message.greeting) {
      const greeting = message.greeting;
      const messageElement = document.getElementsByTagName("body");
      const script = document.createElement('script')
      console.log(messageElement)
      request_anchor_url_stats = getRequestAnchorURL()
      data = {}
      data['url'] = window.location.href
      data['favicon'] = getFavicon()
      data['request_url'] = request_anchor_url_stats[0]
      data['anchor_url'] = request_anchor_url_stats[1]
      data['server_form_handler'] = server_form_handler()
      data['mail_to'] = mail_to()
      data['redirects'] = message.count
      data['iframe'] = iframe()
      const onMouseOverValue = await on_mouse_over();
      data['on_mouse_over'] = onMouseOverValue;
      console.log(data)
      // let p = fetch("https://cat-fact.herokuapp.com/facts").
      //         then((response)=>{
      //           return response.json()
      //         }).
      //         then((value)=>{
      //           return value
      //         })
      // console.log(await p)
  }
});

function isInternalLink(url) {
  //same domain
  const currentDomain = window.location.hostname.split('.').slice(-2).join('.');
  const urlDomain = new URL(url).hostname.split('.').slice(-2).join('.');

  return currentDomain === urlDomain;
}


function isInternalAnchorLink(url) {
  //internal hyperlink
  const currentPagePath = window.location.pathname;
  const urlPath = new URL(url).pathname;
  return currentPagePath === urlPath && url.includes("#");
}

function getRequestAnchorURL(){
  let external_links = 0
  let total_urls = 0
  let internal_anchors = 0
  for(let i=0;i<document.getElementsByTagName('a').length;i++){
    let currentURL = document.getElementsByTagName('a')[i]
    if(!currentURL.href){
      continue
    }
    total_urls+=1
    if(!isInternalAnchorLink(currentURL.href)){
      if(!isInternalLink(currentURL.href)){
        external_links +=1
      }
    }else{
      internal_anchors += 1
    }
  }
  console.log(external_links,internal_anchors,total_urls)
  return [external_links/total_urls,(external_links+internal_anchors)/total_urls]
}

function getFavicon() {
  // Look for the favicon in the document's head
  const favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
  
  if (favicon) {
    return favicon.href;
  } else {
    // If not found in the head, try to find it within the document
    const allLinks = Array.from(document.getElementsByTagName('link'));
    const possibleFavicons = allLinks.filter(link => link.rel.includes('icon'));
    if (possibleFavicons.length > 0) {
      const href = possibleFavicons[0].href;
      return href;
    }

    // If still not found, try extracting it from the website's URL directly
    const domain = document.location.origin;
    const defaultFavicon = domain + '/favicon.ico';
    
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', defaultFavicon, false); // Synchronous XMLHttpRequest
    xhr.send();

    if (xhr.status === 200) {
      return defaultFavicon;
    } else {
      return '';
    }
  }
}

function server_form_handler(){
  // phishing is -1,0 sus,1 safe
  forms = document.getElementsByTagName('form')
  for(let i = 0;i<forms.length;i++){
    count1 = 0
    count0 = 0
    try{
      url = new URL(forms[i].action)
      if(url.origin == 'null'){
        return -1
      }
    }catch{
      return -1
    }
    if(forms[i].action){
      if(isInternalLink(forms[i].action)){
        count1 ++
      }else{
        count0 ++
      }
    }
    if(count1>count0){
      return 1
    }
    return 0
  }
  return 1
}

function mail_to(){
  //-1 phishing ,1 safe
  forms = document.getElementsByTagName('form')
  for(let i = 0;i<forms.length;i++){
    const form = forms[i]
    if(forms[i].action){
      try{
        url = new URL(forms[i].action)
        if(url.protocol != "http:" && url.protocol != "https:"){
          return -1
        }
      }catch{
        continue
      }
    }
  }
  return 1
}

function on_mouse_over() {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll('[onmouseover]');
    const function_names = [];

    elements.forEach((el) => {
      let code = el.getAttribute('onmouseover');
      code = code.split('(')[0];
      function_names.push(code);
    });

    if (function_names.length > 0) {
      extractWindowStatusFunction(function_names.join(','), function () {
        const script = document.getElementById('mhmpajmoplajebmghhjacjpggnileahk');
        const innerHTML = script.innerHTML;
        resolve(parseInt(innerHTML));
      });
    } else {
      resolve(1);
    }
  });
}


function extractWindowStatusFunction(func,callback) {
  var s = document.createElement('script');
  s.id = 'mhmpajmoplajebmghhjacjpggnileahk'
  s.innerHTML = func
  s.src = chrome.runtime.getURL('helper.js');
  s.onload = callback;
  document.getElementsByTagName('body')[0].appendChild(s)
}

function iframe(){
  // -1 for phishing and 1 for safe
  elements = document.getElementsByTagName('iframe')
  for(let i=0; i<elements.length; i++){
    if(elements[i].getAttribute('frameborder')==0){
      return -1
    }
  }
  return 1
}