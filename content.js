//content script that is injected in each page that matches manifest URL specifier

var abbreviationDictionary = {};
var exclusionWords = ["by","a","with","for","of","and","to"];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if(request.message === "toggleSidebar") {
          // Do whatever you want here
          console.log("Button was clicked in the popup!");
          toggleSidebar();
      }
  }
);

//tooltip style formatting that gets appended to head of page
var tooltipStyleStr =
[
'.tooltip {',
'position: relative;',
'display: inline-block;',
'border-bottom: 1px dotted black;',
'}',
'.tooltip .tooltiptext {',
'visibility: hidden;',
'width: 120px;',
'background-color: #555;',
'color: #fff;',
'text-align: center;',
'border-radius: 6px;',
'padding: 5px 0;',
'position: absolute;',
'z-index: 1;',
'bottom: 125%;',
'left: 50%;',
'margin-left: -60px;',
'opacity: 0;',
'transition: opacity 0.3s;',
'}',
'.tooltip .tooltiptext::after {',
'content: "";',
'position: absolute;',
'top: 100%;',
'left: 50%;',
'margin-left: -5px;',
'border-width: 5px;',
'border-style: solid;',
'border-color: #555 transparent transparent transparent;',
'}',
'.tooltip:hover .tooltiptext {',
'visibility: visible;',
'opacity: 1;',
'}'
].join('\n')
$('<style>').text(tooltipStyleStr).appendTo(document.head);

//gets list of all paragraphs in DOM and then loops through
//if a paragraph contains an opening and closing braket updateDictionary() is called 
//and then the internal html text is edited and replaced using edithtmlString() funciton
parNodeList = document.body.querySelectorAll("p");
for (var i = 0; i<parNodeList.length; i++) {
	var item = parNodeList.item(i);
	if (parNodeList[i].textContent.includes("\(") && parNodeList[i].textContent.includes("\)")) {
     updateDictionary(item);
     }
     str = $(item).text();
     $(item).html(edithtmlString(str))
}

//send message to background scipt to get tab info (title and URL) and store
chrome.runtime.sendMessage({tabQuery: "current"}, function(tabInfo){
	abbreviationDictionary["url"] = tabInfo[0];
	abbreviationDictionary["title"] = tabInfo[1];
	console.log(abbreviationDictionary);
	//chrome.storage.sync.set({fullDictionary: abbreviationDictionary}); //previously used for options page
});

/*Function that extracts the full definition for an abbreviation that is introduced
Assumptions:
  -->chars of the abbreviation that are minuscule do not have a leading word
     e.g the s in CSCs or PSCs or the leading i in iPCS
  -->When abbreviation is introduced it is in round brackets and follows the full meaning declaration

Two sections:
  1. Identify parenthetical word
  2. Extract leading full definition 
*/
function updateDictionary(nodeOjb){
    var paragraph = $(nodeOjb).text();
    const openingBracketMatches = [...paragraph.matchAll(/\(/g)];
    const closingBracketMatches = [...paragraph.matchAll(/\)/g)];

    if(openingBracketMatches.length!=closingBracketMatches.length){
        Error("Different number of openingBracketMatches and closingBracketMatches!")
        //unfinished
    }
    else{
        for (var i = 0; i < openingBracketMatches.length; i++)
        {
            parentheticalWord = paragraph.substring(openingBracketMatches[i].index+1,closingBracketMatches[i].index);
            firstChar = parentheticalWord[0];
            majusculeCount = (parentheticalWord.match(/[A-Z]/g)||[]).length;
            
            if (!abbreviationDictionary[parentheticalWord] && parentheticalWord.length < 10 && isLetter(firstChar) && majusculeCount > 1){
              firstMajusculeLetter = listMajuscule(parentheticalWord)[0];

              wordsOfParagraph = paragraph.split(" ");
              if(parentheticalWord.includes(" ")){
              	firstSectionOfparentheticalWord = parentheticalWord.split(" ")[0]
              }else{
              	firstSectionOfparentheticalWord = parentheticalWord;
              }
              const wordMatches = (word) => word.includes(firstSectionOfparentheticalWord); 
              //find index where extracted abbreviation is 
              abbreviationIndex = wordsOfParagraph.findIndex(wordMatches);

              //counts number of uppercase letters in brackets
              mainWordTotal = listMajuscule(parentheticalWord).length; 
              firstLetterRepeats = parentheticalWord.split(firstMajusculeLetter).length-1;
              
              //in theory if start close to the parentheticalWord and count number of words until reach repeats this will be first word of string
              var count = 0;
              var matchCount = 0;
              var mainWordCount = 0;
              //loops backwards through wordsOfParagraph array until has the right number of "main words" or find right number of first letter matches 
              while(mainWordTotal>mainWordCount&&matchCount<firstLetterRepeats&&abbreviationIndex-count>0){
            	  stringAtCurrentIndex = wordsOfParagraph[abbreviationIndex-count-1];
            	  if(!(exclusionWords.indexOf(stringAtCurrentIndex.trim().toLowerCase()) > -1)&&!noLetters(stringAtCurrentIndex)){
          	  		if(stringAtCurrentIndex[0]==firstMajusculeLetter||stringAtCurrentIndex[0]==firstMajusculeLetter.toLowerCase()){
                    matchCount++;
                  }
                  if(stringAtCurrentIndex.indexOf("-")>-1){
                    hyphenIndex = stringAtCurrentIndex.indexOf("-");
                    if(stringAtCurrentIndex[hyphenIndex+1]==firstMajusculeLetter||stringAtCurrentIndex[hyphenIndex+1]==firstMajusculeLetter.toLowerCase()){
                      matchCount++;
                    }
                    mainWordCount++;
                  }  
                  mainWordCount++;
                }
                count++;
              }
              fullMeaning = wordsOfParagraph.slice(abbreviationIndex-count, abbreviationIndex);
              fullMeaning = fullMeaning.join(" ");
              
              abbreviationDictionary[parentheticalWord] = fullMeaning;
            }
        }
    }
}

function isLetter(string){
	if (/^[A-Za-z]*$/.test(string)){
		return true
	}
	return false
}

function listMajuscule(string){
    return string.match(/[A-Z]/g)||[];
}

function listMinuscule(string){
    return string.match(/[a-z]/g)||[];
}

function noLetters(string){
	for(let char of string){
		if(isLetter(char)){
			return false
		}
	}
	return true
}

//Append tooltip format around abbreviation and replace paragraph text with new formatted text
//BUG: If there is a string of char within one abbreviation that is its own abbreviation 
function edithtmlString(str){
  const sortedAbbreviationDic = Object.keys(abbreviationDictionary).sort((a, b) => b.length - a.length);
    for(const abbrev of sortedAbbreviationDic){
        newStr = str.split(abbrev);
        var tooltipStr = '<div class="tooltip">'+abbrev;
        var tooltiptext = '<span class="tooltiptext">'+abbreviationDictionary[abbrev]+'</span>';
        var tooltipInsertionStr = tooltipStr + tooltiptext + '</div>';
        str = newStr.join(tooltipInsertionStr);
    }
    return str;
}

function toggleSidebar() {
  const sidebar = document.getElementById('extensionSidebar');

  if (sidebar) {
    sidebar.remove();
  } else {
    const div = document.createElement('div');
    div.id = 'extensionSidebar';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.right = '0';
    div.style.width = '200px';
    div.style.height = '100%';
    div.style.backgroundColor = 'white';
    div.style.overflowY = 'auto';
    div.style.zIndex = '9999';
    
    // Title
    const titleField = document.createElement('h3');
    titleField.textContent = abbreviationDictionary.title || "No title found";
    div.appendChild(titleField);

    // Table for abbreviations
    const table = document.createElement('table');
    for (const abbreviation in abbreviationDictionary) {
      if (abbreviation !== "url" && abbreviation !== "title") {
        const row = table.insertRow();
        const abbreviationStr = row.insertCell(0);
        const abbreviationDefinition = row.insertCell(1);
        abbreviationStr.textContent = abbreviation;
        abbreviationDefinition.textContent = abbreviationDictionary[abbreviation];
      }
    }
    div.appendChild(table);
    
    document.body.appendChild(div);
  }
}