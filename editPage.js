//get information from chrome storage cache and display in "options" page.

//console.log(URLPopupWasClickedFrom);
parentURL = "test";

//needs arrow notation ... having a lot of trouble getting the promised message to load before accessing the stored dictionary
chrome.runtime.sendMessage({tabQuery: "loadCalledFrom"}, function(pageURL){
	parentURL = pageURL;

});

storedDictionary = chrome.storage.sync.get(getCallerURL(),function(result){
	console.log(parentURL)
	//var fullDictionaryObjectFromStorage = JSON.parse(JSON.stringify(result.key));
	//const storedDictionary = JSON.parse(result['fullDictionary']);
	const storedDictionary = result[parentURL];
	if(Object.keys(storedDictionary).length > 1){
		setName(storedDictionary);
		createTable(storedDictionary)
		console.log(storedDictionary);
		//sanity check
	}
	else{
		console.log("Empty dictionary!")
	}
});

async function getCallerURL(){
	await getURLFromBackground();
	return parentURL;
}

function getURLFromBackground(){
	chrome.runtime.sendMessage({tabQuery: "loadCalledFrom"}, function(pageURL){
	//URLPopupWasClickedFrom = tabInfo[0];
	parentURL = pageURL;
	});
}

function setName(abbreviationObjList) {
	var titleFild = document.getElementById("title");
	if(abbreviationObjList.title){
		titleFild.innerHTML = abbreviationObjList.title;
	}
	else{
		titleFild.innerHTML = "No title found";
	}
}

function createTable(abbreviationObjList) {
	//get the table
	var table = document.getElementById("abbreviationTable");
	// Adding the data to the table
	for (const abbreviation in abbreviationObjList){
		if(abbreviation=="url"||abbreviation=="title"){
			continue;
		}
		var row = table.insertRow(0);
		var abbreviationStr = row.insertCell(0);
		var abbreviationDefinition = row.insertCell(1);
		abbreviationStr.innerHTML = abbreviation;
		abbreviationDefinition.innerHTML = abbreviationObjList[abbreviation];
	}
}
