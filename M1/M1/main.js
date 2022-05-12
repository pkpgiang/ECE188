// JavaScript source code
var helpOpen = 0;
var cameraOpen = 0;

const config = {
	video: { width: 300, height: 400, fps: 30 }
};


async function gestureRecognizer() {

	const video = document.getElementById("videoElement");
	//const canvas = document.querySelector("#videoCanvas");
	//const ctx = canvas.getContext("2d");

	const resultLayer = document.getElementById("camera-emoji");

	// configure gesture estimator
	// add "✌🏻" and "👍" as sample gestures

	const highFiveGesture = new fp.GestureDescription('high_five');
	for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
		highFiveGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
	}

	const thumbsDownGesture = new fp.GestureDescription('thumbs_down');
	thumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
	thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
	thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.9);
	thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.9);
	for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
		thumbsDownGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
		thumbsDownGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
	}

	const okSignGesture = new fp.GestureDescription('ok_sign');
	okSignGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
	okSignGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
	okSignGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
	okSignGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
	okSignGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl,1.0);
	okSignGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl,1.0);
	okSignGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl,1.0);
	okSignGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 1.0);
	okSignGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 1.0);
	okSignGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpLeft, 1.0);
	okSignGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
	okSignGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0);



	const knownGestures = [
		fp.Gestures.VictoryGesture,
		fp.Gestures.ThumbsUpGesture,
		highFiveGesture,
		thumbsDownGesture,
		okSignGesture
	];
	const GE = new fp.GestureEstimator(knownGestures);

	// load handpose model
	const model = await handpose.load();
	console.log("Handpose model loaded");

	// main estimation loop
	const estimateHands = async () => {
		if (cameraOpen == 1) {

			// clear canvas overlay
			//ctx.clearRect(0, 0, config.video.width, config.video.height);
			resultLayer.innerText = '';

			// get hand landmarks from video
			// Note: Handpose currently only detects one hand at a time
			// Therefore the maximum number of predictions is 1
			const predictions = await model.estimateHands(video, true);

			for (let i = 0; i < predictions.length; i++) {

				// draw colored dots at each predicted joint position
				//for (let part in predictions[i].annotations) {
					//for (let point of predictions[i].annotations[part]) {
						//drawPoint(ctx, point[0], point[1], 3, landmarkColors[part]);
					//}
				//}

				// estimate gestures based on landmarks
				// using a minimum score of 9 (out of 10)
				// gesture candidates with lower score will not be returned
				const est = GE.estimate(predictions[i].landmarks, 9);

				if (est.gestures.length > 0) {

					// find gesture with highest match score
					let result = est.gestures.reduce((p, c) => {
						return (p.score > c.score) ? p : c;
					});

					resultLayer.innerText = gestureStrings[result.name];
					console.log("success");
				}

				// update debug info
				//updateDebugInfo(est.poseData);
			}
		}
			// ...and so on
		setTimeout(() => { estimateHands(); }, 1000 / config.video.fps);
		
	};
	
	estimateHands();
    
	console.log("Starting predictions");
}

function convertMorseToLetter(morse) {
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
	if (input in dict) {
		var value = dict[morse];
		return value;
	}
	else {
		return null;
	}
}

function buttonClicked(evt) {
	var whichButton = evt.currentTarget.id;
	var inputField = document.getElementById("input-area");
	switch (whichButton) {
		case "dot":
			console.log("dot pressed");
			if (inputField.value.length < 4) {
				inputField.value = inputField.value + "\u00B7";
				updatePreview();
			}
			break;
		case "dash":
			console.log("dash pressed");
			if (inputField.value.length < 4) {
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
		case "draw":
			changeLayout();
			break;
		case "noDraw":
			backPressed();
			break;
		case "useCamera":
			useCameraPressed();
			break;
		default:
	}
}

function useCameraPressed() {
	console.log("camera pressed");
	var video = document.getElementById('videoElement');
	//if camera is not on then turn on camera
	if (cameraOpen == 0) {
		document.getElementById("videoContainer").style.display = "block";
		document.getElementById("myCanvas").style.display = "none";
		document.getElementById("camera-emoji").style.display = "block";
		cameraOpen = 1;
		video.play();
		document.getElementById("useCamera").innerHTML = "\u27A4";
	}
	else {
		//if not then submit current emoji
		document.getElementById("output-text").textContent = document.getElementById("output-text").textContent + document.getElementById("camera-emoji").innerHTML;
	}
}

function handleSuccess(stream) {
	document.getElementById('videoElement').srcObject = stream;
	console.log('camera load');
}

function handleError() {
	console.log('error on camera');
}

function dotPressed() {
	var inputField = document.getElementById("input-area");
	console.log("dot pressed");
	if (inputField.value.length < 4) {
		inputField.value = inputField.value + "\u00B7";
		updatePreview();
	}
}

function dashPressed() {
	var inputField = document.getElementById("input-area");
	console.log("dash pressed");
	if (inputField.value.length < 4) {
		inputField.value = inputField.value + "\u2212";
		updatePreview();
	}
}

function updatePreview() {
	//updates preview
	//convert morse to letter, if valid then replace preview with new letter
	//if invalid then replace preview with empty
	var inputField = document.getElementById("input-area");
	var letter = convertMorseToLetter(inputField.value);
	var preview = document.getElementById("preview-letter");
	if (letter == null) {
		preview.innerHTML = "";
		if (inputField.value != "") {
			document.getElementById("enter").innerText = "\u27A4";
		}
		else {
			document.getElementById("enter").innerText = "\u2423";
		}
	}
	else {
		preview.innerHTML = letter;
		document.getElementById("enter").innerText = "\u27A4";
	}
}

function helpPressed() {
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

function enterPressed() {
	//if input field is empty then add a space
	//if not empty, convert morse to letter
	//if valid, add to output area and clear input area
	//if not valid, then do popup that says invalid entry
	var inputField = document.getElementById("input-area");
	var outputField = document.getElementById("output-text");
	inputText = inputField.value;
	if (inputText == "") {
		outputField.textContent = outputField.textContent + " ";
	}
	else {
		letter = convertMorseToLetter(inputText);
		if (letter == null) {
			//dont do anything if non applicable entry
		}
		else {
			outputField.textContent = outputField.textContent + letter;
			inputField.value = "";
			document.getElementById("enter").innerText = "\u2423";
			updatePreview();
		}
	}
}

function deletePressed() {
	//if input field is empty then delete one letter in output field (make sure there is something in the output field)
	//else if input field is not empty then delete one letter in input field
	//textspace.value = textspace.value.substring(0, textspace.value.length - 1); for both cases
	var inputField = document.getElementById("input-area");
	var outputField = document.getElementById("output-text");
	if (inputField.value == "") {
		if (outputField.value == "") {
			//do nothing if output is already empty
		}
		else {
			strarray = [...outputField.textContent];
			lastChar = strarray.pop();
			if (lastChar == "\uFE0F" || lastChar =="\uDE2E") {
				strarray.pop();
            }
			outputField.textContent = strarray.join("");
			//outputField.textContent = outputField.textContent.substring(0, outputField.textContent.length - 1);
		}
	}
	else {
		inputField.value = inputField.value.substring(0, inputField.value.length - 1);
		updatePreview();
	}
}

function backPressed() {
	if (cameraOpen == 1) {
		cameraOpen = 0;
		document.getElementById("videoContainer").style.display = "none";
		document.getElementById('videoElement').pause();
		document.getElementById("myCanvas").style.display = "block";
		document.getElementById("camera-emoji").style.display = "none";
		document.getElementById("useCamera").innerHTML = "\uD83D\uDCF7";
	}
	else {
		document.getElementById("myCanvas").style.display = "none";
		document.getElementById("noDraw").style.display = "none";
		document.getElementById("useCamera").style.display = "none";
		document.getElementById("dot").style.display = "block";
		document.getElementById("draw").style.display = "block";
		document.getElementById("help").style.display = "block";
		document.getElementById("enter").style.display = "block";
		document.getElementById("delete").style.display = "block";
    }
}

function changeLayout() {
	document.getElementById("myCanvas").style.display = "block";
	document.getElementById("noDraw").style.display = "block";
	document.getElementById("useCamera").style.display = "block";

	document.getElementById("dot").style.display = "none";
	document.getElementById("draw").style.display = "none";
	document.getElementById("help").style.display = "none";
	document.getElementById("enter").style.display = "none";
	document.getElementById("delete").style.display = "none";

	var canvas = document.getElementById('myCanvas');
	_g = canvas.getContext('2d');
	_g.fillStyle = "rgb(0,0,225)";
	_g.strokeStyle = "rgb(0,0,225)";
	_g.lineWidth = 3;
	_rc = getCanvasRect(canvas); // canvas rect on page
	_g.fillStyle = "rgb(0,0,255)";
	_isDown = false;
}

