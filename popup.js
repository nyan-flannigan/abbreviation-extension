// Initialize button with user's preferred color
/*
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log("Printing tabs as 0")
  console.log(tabs[0]);
});

chrome.storage.sync.get(['fullDictionary'],function(result){
	//var fullDictionaryObjectFromStorage = JSON.parse(JSON.stringify(result.key));
	var fullDictionaryObjectFromStorage = JSON.parse(result['fullDictionary']);
	console.log(fullDictionaryObjectFromStorage);
});
*/

//let storedDictionary = JSON.parse(localStorage.getItem("fullDictionary"));
//console.log("Test!")
//console.log(storedDictionary)

window.onload=function(){
	let editButton = document.getElementById("editButton");
//	editButton.addEventListener((message, sender) => {
//		currentTabID = sender.tab.id;
//	});
	editButton.addEventListener('click', function() {
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
	});
}
// The body of this function will be executed as a content script inside the
// current page
function openEditableList() {
  //chrome.storage.sync.get("color", ({ color }) => {
    //document.body.style.backgroundColor = color;
  //});

}