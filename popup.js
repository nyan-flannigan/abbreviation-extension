/*
send a message to the content script when the button is clicked
*/

document.getElementById('toggleSidebar').addEventListener('click', function() {
    // Send a message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0]; 
        chrome.tabs.sendMessage(currentTab.id, {"message": "toggleSidebar"});
    });
});
