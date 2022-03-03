//content script that is injected in each page that matches manifest URL specifier

var abbreviationDictionary = {};
var exclusionWords = ["by","a","with","for","of","and","to"];

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
	chrome.storage.sync.set({fullDictionary: abbreviationDictionary});
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
    for(const abbrev in abbreviationDictionary){
        newStr = str.split(abbrev);
        var tooltipStr = '<div class="tooltip">'+abbrev;
        var tooltiptext = '<span class="tooltiptext">'+abbreviationDictionary[abbrev]+'</span>';
        var tooltipInsertionStr = tooltipStr + tooltiptext + '</div>';
        str = newStr.join(tooltipInsertionStr);
    }
    return str;
}