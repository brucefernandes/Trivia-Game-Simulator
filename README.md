# Trivia-Game-Simulator
A multiplayer trivia game where users can battle it out to see who has the better general knowledge!

This project was part of my web development course. The only instruction we were given was to create a trivia game using socket.io, allowing
to use our creativity in building this project. Along with node.js , javascript and html, I also decided to dabble in bootstrap to make the 
project look alittle nice. This project was alittle difficult at first, given that I had very little web dev knowledge at the time. However,
being able to go about creating however I felt like made it fun and educational and it was satifying seeing it come together. I am still trying
to update a few features.

HOW TO START THE PROGRAM:
  - Download all the files
  - Install the dependencies by typing "npm install" in the cmd
  - type in "node server.js" to start the server
  - open a web browser and type in "http://localhost:3000/"
  - Multiple browsers can be opened to signify new users joining the game\
  
This program is can only be run on one computer. To simulate multiple players, the user will have to open multiple browsers tabs and go to the server url.

WHEN PAGE LOADS:
	The user is prompted with an input bar and a button. When the user types in their name, and clicks join game, the server adds
	the user to the leaderboard, and sets their score to 0. The user is also given the first question for the round. If another user
	joins the game, both users will be shown their usernames and scores.

ANSWERING QUESTIONS:
	The server waits until both players have answered a question. If a user has not selected a question, his name will be highlighted
	in red and the "next question" button will be disabled. Once a player answers a question, their username is changed to black, indicating they
	have answered. All users can see this change. Once all users have answered, the Next question button is enabled and the users can go on to the
	next question.

END SCREEN:
	Before the last user answers a question, every other user is given a displayer page that says "waiting for other players..."
	Once all the players have finished the round, the name of the winner is displayed and the users are prompted 2 buttons.
	As of now I have not been able to code the functionality of these buttons. The quit button will close the socket connection
	as well as the window indicating the user had left the server. The restart button will make another request to OpenDb for a new set
	of questions thus restarting the round by setting all the scores to 0. However, even though I dont start a new game, when All
	players have finished the quiz and the winner has been announced, the scores are set to 0. 

