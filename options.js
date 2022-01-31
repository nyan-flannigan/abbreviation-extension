//get list of acrynoms
//let storedDictionary = JSON.parse(localStorage.getItem("fullDictionary"));
//console.log("Test!")
//console.log(storedDictionary)
//createTable(storedDictionary)
//in page cache of user's dictionary
//const fullDictionary = {};
//console.log("Tab where edit button was pressed: "+currentTabID);
storedDictionary = chrome.storage.sync.get(['fullDictionary'],function(result){
	//var fullDictionaryObjectFromStorage = JSON.parse(JSON.stringify(result.key));
	//const storedDictionary = JSON.parse(result['fullDictionary']);
	const storedDictionary = result['fullDictionary'];
	if(Object.keys(storedDictionary).length > 1){
		setName(storedDictionary);
		createTable(storedDictionary)
		console.log(storedDictionary);
	}
	else{
		console.log("Empty dictionary!")
	}
});
//abbreviationTable
/*

		var el_up = document.getElementById("GFG_UP");
		
		var list = [
			{"col_1":"val_11", "col_2":"val_12", "col_3":"val_13"},
			{"col_1":"val_21", "col_2":"val_22", "col_3":"val_23"},
			{"col_1":"val_31", "col_2":"val_32", "col_3":"val_33"}
		];
		
		el_up.innerHTML = "Click on the button to create the "
				+ "table from the JSON data.<br><br>"
				+ JSON.stringify(list[0]) + "<br>"
				+ JSON.stringify(list[1]) + "<br>"
				+ JSON.stringify(list[2]);
*/
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
	/*
	var headers = ["Abbreviation","Definition"];
	//for(const abbrev in abbreviationDictionary){

	
	// Create a table element
	var table = document.createElement("abbreviationTable");
	
	// Create table row tr element of a table
	//var tr = table.insertRow(-1);
	
	for (var i = 0; i < headers.length; i++) {
		
		// Create the table header th element
		var theader = document.createElement("th");
		theader.innerHTML = headers[i];
		
		// Append columnName to the table row
		tr.appendChild(theader);
	}
	*/
	//get the table
	//var table = document.createElement("abbreviationTable");
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

	/*
	for (var i = 0; i < storedDictionary.length; i++) {
		
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.innerHTML = "NEW CELL1";
  cell2.innerHTML = "NEW CELL2";


		// Create a new row
		trow = table.insertRow(-1);
		for (var j = 0; j < headers.length; j++) {
			var cell = trow.insertCell(-1);
			
			// Inserting the cell at particular place
			cell.innerHTML = list[i][headers[j]];
		}
	}
	
	// Add the newly created table containing json data
	var el = document.getElementById("table");
	el.innerHTML = "";
	el.appendChild(table);
	*/
}
