/*
runs block after popup.html has loaded
Attatches listener to edit button and if clicked opens the built in
chrome options page. If already open switches the active tab to it
*/

window.onload=function(){
	let editButton = document.getElementById("editButton");

	editButton.addEventListener('click', function() {
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
	});
}

/*
chrome.storage.sync.get(['fullDictionary'],function(result){
	//var fullDictionaryObjectFromStorage = JSON.parse(JSON.stringify(result.key));
	var fullDictionaryObjectFromStorage = JSON.parse(result['fullDictionary']);
	console.log(fullDictionaryObjectFromStorage);
});
*/

