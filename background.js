/*
Cannot directly get information about the tabs from a content script so must send a message from the content script to a backgroud script
This background script returns the current tab's title and URL and sends it back to the main content script to get stored in appreviation dictionary
*/
parentURL = "test";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getURL(request).then(sendResponse);
  return true; // return true to indicate you want to send a response asynchronously
});

//async, awaits promise and returns once promise returns to send reponse 
async function getURL(request){
	if(request.tabQuery == "current"){  		
  		tabs = await chrome.tabs.query({currentWindow: true, active: true});
  		return [tabs[0].url, tabs[0].title];
  	}
  	if(request.tabQuery == "getCalledFrom"){  		
  		tabs = await chrome.tabs.query({currentWindow: true, active: true});
  		parentURL = tabs[0].url;
  		return tabs;
  	}
  	if(request.tabQuery == "loadCalledFrom"){ 	
  		console.log(parentURL)
  		return parentURL;
  	}
}

