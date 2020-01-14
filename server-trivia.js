
const http = require('http');
const fs = require('fs');
var request = require('request');
var quiz = [];

var score_buf = [];


function send404(response) {
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('Error 404: Resource not found.');
	response.end();
}




//Create a server, giving it the handler function
//Request represents the incoming request object
//Response represents the outgoing response object
//Remember, you can break this apart to make it look cleaner
const server = http.createServer(function (req, res) {

	if (req.method == 'GET') {


		if(req.url == "/"){
			console.log("Serving: " + req.url);
			res.writeHead(200, {'Content-type': 'text/html'});
			var myReadStream = fs.createReadStream(__dirname + '/trivia.html', 'utf8');
			myReadStream.pipe(res);

			//Making the http request to the database
			var XMLHttpRequest = require('xhr2');
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {

				if( xhr.status == 200  && xhr.readyState == 4){

					let js_array = JSON.parse(xhr.response);

					if(js_array["response_code"] == '0'){
						if(quiz.length == 0 ){
							for(let i = 0; i< 5; i++){
								quiz.push(js_array.results[i]);

							}
							console.log("Printing length of question obj: ", quiz.length);
						}
					}
					else{
						alert('ERROR: PAGE NOT FOUND!');
					}
				}
			}
			xhr.open('GET', 'https://opentdb.com/api.php?amount=10', true);
			xhr.send(null);

		}

		else if(req.url == "/client-trivia.js"){
			console.log("Serving: " + req.url);
			res.writeHead(200, {'Content-type': 'text/javascript'});
			var myReadStream = fs.createReadStream(__dirname + "/client-trivia.js", 'utf8');
			myReadStream.pipe(res);

		}

		else if(req.url == "/socket.io/socket.io.js"){
			console.log("Serving: " + req.url);
			res.writeHead(200, {'Content-type': 'text/javascript'});
			var myReadStream = fs.createReadStream(__dirname + '/socket.io/socket.io.js', 'utf8');
			myReadStream.pipe(res);

		}
		else if(req.url == "/background.jpg"){
			console.log("Serving: " + req.url);
			res.writeHead(200, {'Content-type': 'image/jpeg'});
			var myReadStream = fs.createReadStream(__dirname + '/background.jpg', 'utf8');
			myReadStream.pipe(res);

		}

	}



	else{
		send404(res);
	}


});



var players = [];
//creating our io object on the server
const io = require('socket.io')(server);

io.on('connection', socket => {
	//socket = the server side of the socket connection
	console.log('somebody connected to the server');
	console.log('Socket value: ' + socket);


	socket.on('disconnect', msg => {
		console.log(socket.player + ' disconnected from the server');
		console.log('msg value: ' + msg);

		let counter = 0;
		players.forEach(item => {

			if(item['gamertag'] == socket.player){
				players.splice(counter, 1);

			}
			counter++;

		});

		io.emit('render', JSON.stringify(players));

	});

	socket.on('join', username => {
		let gamer = JSON.parse(username);
		socket.player = gamer['gamertag'];
		console.log( socket.player + ' joined the fight!');
		players.push(gamer);

		//Requesting the player list everything render is called
		io.emit('render', JSON.stringify(players));
		io.emit('getQuestion', JSON.stringify(quiz));

	});

	socket.on('score', score =>{
		console.log("Chainging score....");
		players.forEach(item =>{
			if(item['gamertag'] == socket.player){
				item['score'] = score;

			}

		});
		io.emit('render', JSON.stringify(players));


	});

	socket.on('button_hit', item => {
		console.log("Answered...changing to black...");
		let btn_hit = JSON.parse(item);

		if(btn_hit){
			players.forEach(item =>{
				if(item['gamertag'] == socket.player){
					item['color'] 	 = 'black';
					item['answered'] = true;

				}

			});
			let count = 0;
			players.forEach(item =>{
				if(item['answered'] == true){
					count++;
				}
			});

			if(count == players.length){
				console.log("All players have answered!");
				io.emit('enable', JSON.stringify(true));

			}


		}

		io.emit('render', JSON.stringify(players));
	})

	socket.on('change_red', item => {
		console.log("changing to red...")
		let change_red = JSON.parse(item);

		if(change_red){
			players.forEach(item =>{
				if(item['gamertag'] == socket.player){
					item['color']	 = 'red';
					item['answered'] = false;


				}

			});
		}
		io.emit('render', JSON.stringify(players));
	});

	socket.on('gameover', item =>{

		let a_counter = 0;

		players.forEach( item =>{
			if(item['answered'] == false){
				a_counter++;
				score_buf.push(item['score']);
			}
		});
		console.log(players);
		console.log('players who have answered: ' + a_counter);
		console.log("Scores: " + score_buf);

		if(a_counter == players.length){

			let max_score = Math.max(...score_buf);
			let winner = [];
			players.forEach( item =>{
				if(item['score'] == max_score){
					winner.push(item['gamertag']);
				}
			});

			let final_winner = '';
			if(winner.length == 2){
				final_winner = winner[0] + " and " + winner[1] + " are the winners!";

			}
			else if (winner.length == 1){
				final_winner = winner[0] + " has won the game!";
			}

			players.forEach( item =>{
				item['score'] = 0;
			});
			io.emit('render', JSON.stringify(players));

			io.emit('winner', JSON.stringify(final_winner));


		}
	})







});

//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
