// JavaScript source code
var helpOpen = 0;

function init(){
	var buttons = ["dot", "dash", "help", "enter", "delete"];
	for(var x in buttons){
		button = document.getElementById(buttons[x]);
		button.addEventListener("click", buttonClicked);
	}
	document.getElementById("input-area").value="";
	document.getElementById("output-text").textContent="";
	document.getElementById("preview-letter").value="";
}

function convertMorseToLetter(morse){
	var dict = {};
	dict["\u00B7\u2212"] = "a";
	dict["\u2212\u00B7\u00B7\u00B7"] = "b";
	dict["\u2212\u00B7\u2212\u00B7"] = "c";
	dict["\u2212\u00B7\u00B7"] = "d";
	dict["\u00B7"] = "e";
	dict["\u00B7\u00B7\u2212\u00B7"] = "f";
	dict["\u2212\u2212\u00B7"] = "g";
	dict["\u00B7\u00B7\u00B7\u00B7"] = "h";
	dict["\u00B7\u00B7"] = "i";
	dict["\u00B7\u2212\u2212\u2212"] = "j";
	dict["\u2212\u00B7\u2212"] = "k";
	dict["\u00B7\u2212\u00B7\u00B7"] = "l";
	dict["\u2212\u2212"] = "m";
	dict["\u2212\u00B7"] = "n";
	dict["\u2212\u2212\u2212"] = "o";
	dict["\u00B7\u2212\u2212\u00B7"] = "p";
	dict["\u2212\u2212\u00B7\u2212"] = "q";
	dict["\u00B7\u2212\u00B7"] = "r";
	dict["\u00B7\u00B7\u00B7"] = "s";
	dict["\u2212"] = "t";
	dict["\u00B7\u00B7\u2212"] = "u";
	dict["\u00B7\u00B7\u00B7\u2212"] = "v";
	dict["\u00B7\u2212\u2212"] = "w";
	dict["\u2212\u00B7\u00B7\u2212"] = "x";
	dict["\u2212\u00B7\u2212\u2212"] = "y";
	dict["\u2212\u2212\u00B7\u00B7"] = "z";
	var input = morse;
	if(input in dict){
		var value = dict[morse];
		return value;
	}
	else {
		return null;
	}
}

function buttonClicked(evt){
	var whichButton = evt.currentTarget.id;
	var inputField = document.getElementById("input-area");
	switch(whichButton) {
		case "dot":
			console.log("dot pressed");
			if(inputField.value.length < 4){
				inputField.value = inputField.value + "\u00B7";
				updatePreview();
			}
			break;
		case "dash":
			console.log("dash pressed");
			if(inputField.value.length < 4){
				inputField.value = inputField.value + "\u2212";
				updatePreview();
			}
			break;
		case "help":
			console.log("help pressed");
			helpPressed();
			break;
		case "enter":
			console.log("enter pressed");
			enterPressed();
			break;
		case "delete":
			console.log("del pressed");
			deletePressed();
			break;
		default:
	}
}

function updatePreview(){
//updates preview
//convert morse to letter, if valid then replace preview with new letter
//if invalid then replace preview with empty
	var inputField = document.getElementById("input-area");
	var letter = convertMorseToLetter(inputField.value);
	var preview = document.getElementById("preview-letter");
	if(letter==null){
		preview.value = "";
		if(inputField.value!=""){
			document.getElementById("enter").innerText = "\u27A4";
		}
		else {
			document.getElementById("enter").innerText = "\u2423";
		}
	}
	else {
		preview.value = letter;
		document.getElementById("enter").innerText = "\u27A4";
	}
}

function helpPressed(){
//check variable of helpOpen and toggle overlay based on that
	if (helpOpen == 2) {
		helpOpen = 0;
		document.getElementById("morse-manual").style.display = "none";
		document.getElementById("help-screen").style.display = "none";
	}
	else if (helpOpen == 1) {
		helpOpen = 2;
		document.getElementById("help-text").style.display = "none";
		document.getElementById("morse-manual").style.display = "block";
	}
	else {
		helpOpen = 1;
		document.getElementById("help-text").style.display = "block";
		document.getElementById("help-screen").style.display = "block";
    }
	document.getElementById("tooltip").style.visibility = "hidden";
}

function enterPressed(){
//if input field is empty then add a space
//if not empty, convert morse to letter
//if valid, add to output area and clear input area
//if not valid, then do popup that says invalid entry
	var inputField = document.getElementById("input-area");
	var outputField = document.getElementById("output-text");
	inputText = inputField.value;
	if(inputText==""){
		outputField.textContent = outputField.textContent + " ";
	}
	else{
		letter = convertMorseToLetter(inputText);
		if(letter==null){
			//dont do anything if non applicable entry
		}
		else{
			outputField.textContent = outputField.textContent + letter;
			inputField.value = "";
			document.getElementById("enter").innerText = "\u2423";
			updatePreview();
		}
	}
}

function deletePressed(){
//if input field is empty then delete one letter in output field (make sure there is something in the output field)
//else if input field is not empty then delete one letter in input field
//textspace.value = textspace.value.substring(0, textspace.value.length - 1); for both cases
	var inputField = document.getElementById("input-area");
	var outputField = document.getElementById("output-text");
	if(inputField.value ==""){
		if(outputField.value ==""){
			//do nothing if output is already empty
		}
		else {
			outputField.textContent = outputField.textContent.substring(0, outputField.textContent.length - 1);
		}
	}
	else{
		inputField.value = inputField.value.substring(0, inputField.value.length - 1);
		updatePreview();
	}
}

window.onload=function(){
    helpOpen = 0;
	init();
};
