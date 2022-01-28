//alert("The Website Will Track Acronyms!")

var abbreviationDictionary = {};
var exclusionWords = ["by","a","with","for","of","and","to"];
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


parNodeList = document.body.querySelectorAll("p");
for (var i = 0; i<parNodeList.length; i++) {
	var item = parNodeList.item(i);
	if (parNodeList[i].textContent.includes("\(") && parNodeList[i].textContent.includes("\)")) {
     updateDictionary(item);
     }
     str = $(item).text();
     $(item).html(edithtmlString(str))
}


//parNode = document.getElementById("Par22");
//updateDictionary(parNode);

//console.log('local storage length after extracting abbrvs '+localStorage.length)


//this function assumes that chars of the abbreviation that are minuscule do not have a leading word
// e.g the s in CSCs or PSCs or the leading i in iPCS
function updateDictionary(nodeOjb){
    var str = $(nodeOjb).text();
    const openingBracketMatches = [...str.matchAll(/\(/g)];
    const closingBracketMatches = [...str.matchAll(/\)/g)];

    if(openingBracketMatches.length!=closingBracketMatches.length){
        Error("Different number of openingBracketMatches and closingBracketMatches!")
    }
    else{
        for (var i = 0; i < openingBracketMatches.length; i++)
        {
            temp = str.substring(openingBracketMatches[i].index+1,closingBracketMatches[i].index);
            firstChar = temp[0];
            majusculeCount = (temp.match(/[A-Z]/g)||[]).length;
            
            if (!abbreviationDictionary[temp] && temp.length < 10 && isLetter(firstChar) && majusculeCount > 1){
              firstMajusculeLetter = listMajuscule(temp)[0];

              wordsOfStr = str.split(" ");
              if(temp.includes(" ")){
              	firstSectionOfTemp = temp.split(" ")[0]
              }else{
              	firstSectionOfTemp = temp;
              }
              const wordMatches = (word) => word.includes(firstSectionOfTemp); 
              //find index where extracted abbreviation is 
              abbreviationIndex = wordsOfStr.findIndex(wordMatches);

              mainWordTotal = listMajuscule(temp).length;
              firstLetterRepeats = temp.split(firstMajusculeLetter).length-1;
              
              //in theory if start close to () and count number of words until reach repeats this will be first word of string
              var count = 0;
              var matchCount = 0;
              var mainWordCount = 0;
              //loops backwards through wordsOfStr array until has the right number of "main words" or find right number of first letter matches 
              while(mainWordTotal>mainWordCount&&matchCount<firstLetterRepeats&&abbreviationIndex-count>0){
              	  stringAtCurrentIndex = wordsOfStr[abbreviationIndex-count-1];
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
              fullMeaning = wordsOfStr.slice(abbreviationIndex-count, abbreviationIndex);
              fullMeaning = fullMeaning.join(" ");
              
              //console.log(temp)
              //localStorage.setItem(temp,fullMeaning);
              abbreviationDictionary[temp] = fullMeaning;
              //localStorage.setItem("fullDictionary",JSON.stringify(abbreviationDictionary));
              JSON_string = JSON.stringify(abbreviationDictionary);
              chrome.storage.sync.set({fullDictionary: JSON_string});
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


//str
//find index of ( and ) then create substring of inner text
//compare to map / dictonary. Append formatted around (xyz)
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