

var update = 0;
var socket = 0;
var qNum = 0;
var question_obj = 0;
var score = 0;

function init(){

	document.getElementById("joinButton").addEventListener("click",joinGame);
	//document.getElementById("random").addEventListener("click", randomTest);


}

function render(){


	let scoreboard = document.getElementById("scoreboard");
		//socket = io()
		socket.on('render', gamer_list =>{

		if(scoreboard.hasChildNodes() != null){
			console.log('Rendering...');
			console.log("clearing list...");
			while(scoreboard.firstChild){
				scoreboard.removeChild(document.getElementById('scoreboard').firstChild);
			}
		}

		let gamers = JSON.parse(gamer_list);


		gamers.forEach(item => {


			let list_ele 		= document.createElement('li');
			list_ele.id 		= item['gamertag'];
			list_ele.innerHTML 	= item['gamertag'] + ' Score: ' + item['score'];
			if(item['color'] == 'red'){
				list_ele.style.color = '#DC143C';

			}
			else if (item['color'] == 'black'){
				list_ele.style.color = '';
			}

			scoreboard.appendChild(list_ele);

			});


		});

}
function joinGame(){

	if(socket == 0){
			socket = io();

			let new_user =
			 {gamertag: document.getElementById('username').value,
			  score:	 	score,
			  color: 		'red',
			  answered: 	false,
		  	};


			socket.emit('join', JSON.stringify(new_user));
			document.getElementById("joinButton").disabled 		= true;
			document.getElementById("joinButton").innerHTML 	= 'Bask in battle!';
			document.getElementById("username").value			= "Nuff said";
			document.getElementById("username").disabled		= true;

			socket.on('getQuestion', questions =>{
				console.log("Recevied the question res")
				question_obj = JSON.parse(questions);

				console.log('Calling displayquestions now....');
				displayQuestion(qNum);

			});

			render();

		}


	console.log("Creating NEXT button....");
	let next_question = document.createElement('button');
	next_question.setAttribute('type', 'button');
	next_question.setAttribute('id', 'next_question');
	next_question.innerHTML = 'Next Qestion!';
	next_question.setAttribute('value', 'next_question');
	next_question.setAttribute('class', "btn btn-outline-success");
	next_question.disabled = true;

	socket.on('enable', item =>{
		if (JSON.parse(item) == true){
			next_question.disabled = false;
		}
	});

	document.getElementById("someButton").appendChild(next_question);
	document.getElementById("next_question").addEventListener("click", () => {
		 socket.emit('change_red', JSON.stringify(true));
		 checkQuestion(qNum);
		 if(qNum < 5){
			 console.log("before increment: " + qNum);
			 qNum++;
			 console.log("after increment: " + qNum);
			 if(qNum == 4){
				 next_question.innerHTML = 'Finish the Battle!';

			 }

			 displayQuestion(qNum);
			 next_question.disabled = true;


			 if(qNum == 5){
				 console.log("You have finished the quiz!");
				 //document.getElementById("next_question").click();


				 document.getElementById("testBlock").innerHTML = 'Waiting for other players...';
				 document.getElementById("someButton").innerHTML = '';

				 socket.emit('gameover', "And the winner is...");
				 socket.on('winner', item =>{
					 let winner_text = JSON.parse(item);

					 let b = document.getElementById('testBlock')
					 let msg = document.createElement('label');
					 msg.innerHTML = winner_text;
					 b.innerHTML = '';
					 b.appendChild(msg);


					 let quit = document.createElement('button');
 					quit.setAttribute('type', 'button');
 					quit.setAttribute('id', 'quit');
 					quit.innerHTML = 'Forfeit the Battle...';
 					quit.setAttribute('value', 'forfeit');
 					quit.setAttribute('class', "btn btn-outline-danger");
					quit.onclick = function(){
						socket.emit('close', 'destroy');
						socket.emit('disconnect', 'please')


					}

 					let restart = document.createElement('button');
 					restart.innerHTML = 'Rematch for the fans!';
 					restart.setAttribute('type', 'button');
 					restart.setAttribute('id', 'restart');
 					restart.setAttribute('value', 'restart');
 					restart.setAttribute('class', "btn btn-outline-primary");

 					let group = document.createElement('div');
 					group.setAttribute('class', 'btn-group');
 					group.setAttribute('role', 'group');
 					group.setAttribute('aria-label', "restartandquit");
 					group.appendChild(restart);
 					group.appendChild(quit);

					document.getElementById('someButton2').appendChild(group);

				 })


			 }

		 }

	} );


}



function displayQuestion(qNum){

	if(qNum < 5){
		console.log("Display function called with questions: " + qNum);
		let testList = document.getElementById("testBlock");


		if(testList.hasChildNodes() != null){
			testList.innerHTML = '';

		}

		//Creates the question
		let question_label = document.createElement('label');
		//adds the question to the label
		question_label.innerHTML = (qNum + 1) + ': ' + question_obj[qNum]["question"];
		question_label.setAttribute('id', qNum);
		question_label.setAttribute('class', 'qs');
		//adds the label to the main test p block
		document.getElementById("testBlock").appendChild(question_label);
		document.getElementById("testBlock").appendChild(document.createElement("br"));

		//Create ul for answer
		let ans_list = document.createElement('ul');
		ans_list.setAttribute('id', 'answerlist' + qNum);
		document.getElementById("testBlock").appendChild(ans_list);

		//Adding the answers
		let a = [];
		for(let j=0; j<question_obj[qNum]["incorrect_answers"].length; j++){
			a.push(question_obj[qNum]["incorrect_answers"][j]);

		}

		//ADDING THE CORRECT ANSWER
		a.push(question_obj[qNum]["correct_answer"]);
		//randomzing it
		a = shuffle(a);
		let counter = 0;
		a.forEach( element =>{
			//Creates RadioButton
			let radio_button = document.createElement('input');
			radio_button.setAttribute('type', 'radio');
			radio_button.setAttribute('value', element)
			radio_button.setAttribute('id', 'radio' + counter);
			radio_button.setAttribute('name', 'btn' + counter);
			radio_button.onclick = function() {
			    if(showResult(this.name)){
					console.log("answered...seeting answered to true");

					let btn_hit = true;
					socket.emit('button_hit', JSON.stringify(btn_hit));

				}
			  }

			function showResult(name) {
			  let x = document.getElementsByName(name);
			  for (let i = 0; i < x.length; i++) {
			    x[i].disabled = true;
			  }
			  return true;
			}
			//Creates the label for the radionutton
			let lbl = document.createElement('label');
			lbl.setAttribute('for', element)
			lbl.innerHTML = element;

			//adds the list_ele to the ul
			ans_list.appendChild(radio_button);
			ans_list.appendChild(lbl);

			ans_list.appendChild(document.createElement("br"));
			counter++
		});

	}

	else{

	}

}





function checkQuestion(qNum){

	let correct_answer 	  = question_obj[qNum]['correct_answer'];
	let incorrect_answers = question_obj[qNum]['incorrect_answers'];
	console.log("Correct answer: " + correct_answer);


	let q_block = document.getElementById('answerlist' + qNum);
	let a_btns 	= q_block.getElementsByTagName('input');
	let answers = q_block.getElementsByTagName('label');

	for(let j=0;j<answers.length;j++){
		if((a_btns[j].checked == true) && (answers[j].innerHTML == correct_answer)){
			console.log("You chose wisely");
			score+=100;
			break;
		}
		else if (a_btns[j].checked == true){
			console.log("You chose poorly!");
			score-=100;
			break;

		}

	}
	console.log("Sending score....");
	socket.emit('score', JSON.stringify(score));




}





var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
