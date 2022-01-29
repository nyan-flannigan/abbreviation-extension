
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getURL(request).then(sendResponse);
  return true; // return true to indicate you want to send a response asynchronously
});

//great function as async then awair promise to return once promise returns send reponse 
async function getURL(request){
	if(request.tabQuery == "current"){
  		//firstTabURL = chrome.tabs.query({currentWindow: true}, function(tabs){return tabs[0].url})
  		
  		tabs = await chrome.tabs.query({currentWindow: true});
  			//sendResponse({tabTest: temp});
  			//sendResponse({temp});
  		//console.log(promise);
  		//console.log("sent")
  		//sendResponse(String(tabs[0].url));
  		
  		//promise = chrome.tabs.query({currentWindow: true});
  		//sendResponse(getCurrentTab);
  		return tabs;
  	}
  	
}

async function getCurrentTab(){
	//let queryOptions = {active: true, currentWindow: true};
	let queryOptions = {currentWindow: true};
	let [tab] = await chrome.tabs.query(queryOptions)
	return tab;
}

/*
chrome.tabs.query({currentWindow: true}, function(tabs) {
    tabs.forEach(function(tab) {
        console.log('Tab ID: ', tab.id);
    });
});

firstTabURL = chrome.tabs.query({currentWindow: true}, function(tabs){
	
	return tabs[0].url
});

console.log(firstTabURL)*/