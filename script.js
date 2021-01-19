

var currentQuestion = 0;
var questions = document.getElementsByClassName("question")

//Dev option to disable pulling questions from wolfram to save cloud credits
var pullQuestions = true;

for (i = 0; i < questions.length; i++) {
	//only show current question
	if(i != currentQuestion) {
		questions[i].hidden = true;
	}


	//* create question select buttons *//
	var butt = document.createElement("button");
	butt.n = i

	//Event lister for each button to switch questions
	butt.addEventListener("click", function() {
		questions[currentQuestion].hidden = true;
		currentQuestion = this.n;
		questions[currentQuestion].hidden = false;
	})

	var t = document.createTextNode(i+1);
	butt.appendChild(t);
	document.getElementById("question-select").appendChild(butt);

	//* create interpretation input boxes *//
	var eq_inputs = questions[i].getElementsByClassName("user-input")
	for(j = 0; j < eq_inputs.length; j++) {
		//Interpretation div has input box and text describing wolframs interpretation
		var input = document.createElement("input")
		input.className = "input"

		var interpretation = document.createElement("text")
		interpretation.className = "interpretation"
		interpretation.innerHTML = " Interpreted as : ---"

		eq_inputs[j].appendChild(input)
		eq_inputs[j].appendChild(interpretation)

		var searchTimeout;
		eq_inputs[j].addEventListener("input", function(result) {
			inp = this.getElementsByClassName("input")[0]
			inter = this.getElementsByClassName("interpretation")[0]

			//Only call wolfram after user hast typed in a certain amount of time 
			if (searchTimeout != undefined ) {
				inter.innerHTML = " Interpreted as : ---"
				clearTimeout(searchTimeout);
			}
			
			//Wolfram call
			renderInterpretation = function(value) {
				var wcc = new WolframCloudCall();
				wcc.call(" ", " ", "I", inp.value, function(result) { 
					
					result = result[0]	
					if(result != null) {
						if(result.startsWith("\\text{Failure}")) {
							inter.innerHTML = " No Interpretation";
						} else {
							inter.innerHTML = " Interpreted as : " + result;
							katex.render( " \\text{ Interpreted as : }" + result, inter, {
								throwOnError: false
							});
						}
					} else {
						object.innerHTML = ""
					}
				});
			}

			if(inp.value != "") {
				searchTimeout = setTimeout(renderInterpretation.bind(null, this.value), 200);
			} else {
				clearTimeout(searchTimeout);
			}

		})
		
	}
	//* pull and render wolfram questions in latex *//
	var questionEquations = questions[i].getElementsByClassName("question-latex")
	for(j = 0; j < questionEquations.length; j++) {
		if(pullQuestions) {
			var wcc = new WolframCloudCall(t);
			wcc.call(" ", questions[i].id, "Q", " ", function(result) { 
				var objects = document.getElementById(result[1]).getElementsByClassName("question-latex")
				console.log(objects)
				if(objects.length == 1) {
					katex.render(result[0], objects[0], {
						throwOnError: false
					});
				} else {
					console.log(result)
					result = result[0].substring(1,result[0].length-1).split(",")
					
					for(k = 0; k < objects.length; k++) {
						
						katex.render(result[k], objects[k], {
							throwOnError: false
						});
					}
				}
			});		
		}	
	}
}


//* Check answer button *//
var incorrectBorder = "1px solid red";
var correctBorder = "1px solid green";

borders = []

document.getElementById("check-answer").addEventListener("click", function() {
	
	var eq_inputs = questions[currentQuestion].getElementsByClassName("user-input")
	var answers;
	
	if(eq_inputs.length > 1) {
		answers = []
		for(j = 0; j < eq_inputs.length; j++) {
			answers.push(eq_inputs[j].getElementsByClassName("input")[0].value)
		}
		answers = "{" + answers.toString() + "}"
	} else if (eq_inputs.length == 1) {
		answers = eq_inputs[0].getElementsByClassName("input")[0].value
	} else {
		return;
	}
	console.log(answers)
	var wcc = new WolframCloudCall();
	wcc.call(" ", questions[currentQuestion].id, "A", answers , function(result) { 
		
		var object = document.getElementById(result[1])
			
		var response;
		console.log(result)
		if(result[0].startsWith("{")) {
			response = result[0].substring(1,result[0].length-1).replace(" ","").split(",")
			if(response.length != object.getElementsByClassName("user-input").length) {
				console.log("Note : Wolfram return different number of answer signals then there are input boxes")
			}

			for(i = 0; i < response.length; i++) {
				console.log(response[i])
				var input_box = object.getElementsByClassName("user-input")[i].getElementsByClassName("input")[0]
				if(response[i] == "True") {
					input_box.style.border = correctBorder
				} else {
					input_box.style.border = incorrectBorder
				}
			}
		} else {
			var input_box = object.getElementsByClassName("user-input")[0].getElementsByClassName("input")[0]
			if(result[0] == "True") {
				input_box.style.border = correctBorder
			} else {
				input_box.style.border = incorrectBorder

			}
		}
	});
})

console.log(parseInt("1"))



