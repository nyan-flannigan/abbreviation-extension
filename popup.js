/*
runs block after popup.html has loaded
Attatches listener to edit button and if clicked opens the built in
chrome options page. If already open switches the active tab to it
*/
chrome.runtime.sendMessage({tabQuery: "getCalledFrom"}, function(tabInfo){
	//URLPopupWasClickedFrom = tabInfo[0];
	console.log(tabInfo);
});

window.onload=function(){


	let editButton = document.getElementById("editButton");

	editButton.addEventListener('click', function() {
		/*
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
	  */
	  //var editWindow = window.open("", "editWindow", "width=200,height=100");
	  //editWindow.document.write("<p>This is 'editWindow'. I am 200px wide and 100px tall!</p>");
	  var editWindow = chrome.windows.create({url: 'editPage.html', type: 'panel'})
	  //divElementURL = document.createElement('div');
	  //divElementURL.id = URLPopupWasClickedFrom;
	  //editWindow.document.body.append(divElementURL)
	});

}

/*
chrome.storage.sync.get(['fullDictionary'],function(result){
	//var fullDictionaryObjectFromStorage = JSON.parse(JSON.stringify(result.key));
	var fullDictionaryObjectFromStorage = JSON.parse(result['fullDictionary']);
	console.log(fullDictionaryObjectFromStorage);
});
*/

