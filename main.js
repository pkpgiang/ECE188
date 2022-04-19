// JavaScript source code
var helpOpen = false;

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
	dict[".-"] = "a";
	dict["-..."] = "b";
	dict["-.-."] = "c";
	dict["-.."] = "d";
	dict["."] = "e";
	dict["..-."] = "f";
	dict["--."] = "g";
	dict["...."] = "h";
	dict[".."] = "i";
	dict[".---"] = "j";
	dict["-.-"] = "k";
	dict[".-.."] = "l";
	dict["--"] = "m";
	dict["-."] = "n";
	dict["---"] = "o";
	dict[".--."] = "p";
	dict["--.-"] = "q";
	dict[".-."] = "r";
	dict["..."] = "s";
	dict["-"] = "t";
	dict["..-"] = "u";
	dict["...-"] = "v";
	dict[".--"] = "w";
	dict["-..-"] = "x";
	dict["-.--"] = "y";
	dict["--.."] = "z";
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
			if(inputField.value.length < 5){
				inputField.value = inputField.value + ".";
				updatePreview();
			}
			break;
		case "dash":
			console.log("dash pressed");
			if(inputField.value.length < 5){
				inputField.value = inputField.value + "-";
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
			document.getElementById("enter").innerText = document.getElementById("hiddenenter").innerHTML;
		}
		else {
			document.getElementById("enter").innerText = document.getElementById("hiddenspace").innerHTML;
		}
	}
	else {
		preview.value = letter;
		document.getElementById("enter").innerText = document.getElementById("hiddenenter").innerHTML;
	}
}

function helpPressed(){
//check variable of helpOpen and toggle overlay based on that
	if(helpOpen){
		helpOpen = false;
		document.getElementById("help-screen").style.display = "none";
	}
	else {
		helpOpen = true;
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
			document.getElementById("enter").innerText = document.getElementById("hiddenspace").innerHTML;
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
    helpOpen = false;
	init();
};
