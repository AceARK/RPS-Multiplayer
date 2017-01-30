var playerCount = 0;
var player_1_Wins = 0; 
var player_2_Wins = 0; 
var player_1_Losses = 0; 
var player_2_Losses = 0; 
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";
var thisWindowPlayer = "Guest";
var player1Ref, player2Ref;
var turns = 0;
var timeStamp;
var disconnectedPlayer_1_name;
var disconnectedPlayer_2_name;

var gameState = {
	playerOneJoined: false,
	playerTwoJoined: false,
	gameInProgress: false,
	playerOneMadeChoice: false,
	playerTwoMadeChoice: false,
	playerOneWinUpdated: false,
	playerTwoWinUpdated: false
};

// Firebase configuration
var config = {
    apiKey: "AIzaSyAILOg8-tbxJw_UbDgCPf5aeEuwVXMehLU",
    authDomain: "rpsforkukki.firebaseapp.com",
    databaseURL: "https://rpsforkukki.firebaseio.com",
    storageBucket: "rpsforkukki.appspot.com",
    messagingSenderId: "158144925744"
  };

firebase.initializeApp(config);
// Getting firebase database reference
database = firebase.database();

// Hiding rock paper scissors choices before start of game
$(".choices").hide();

// On click of Start Button
$("#startButton").on("click", function(event) {
	event.preventDefault();
	// If no players exist in database i.e. this is the first client to click on start button
	if(playerCount === 0) {
		// If number of players = 0, take name as player 1
		player_1_Name = $("#userName").val();

		// Preparing player1 data to pass to database
		var playerData = {
			name: player_1_Name,
			wins: 0,
			losses: 0	
		}
		// Storing current window player in variable thisWindowPlayer to display customized messages
		thisWindowPlayer = player_1_Name;

		// Storing player 1 db reference in variable
		player1Ref = database.ref("players/1");
		// Creating new player in database and passing player data to it
		player1Ref.set(playerData);
		// Listening to disconnection of player 1 and removing from db
		player1Ref.onDisconnect().remove();
		// Setting disconnectedPlayerName as this player name for future use
		disconnectedPlayer_1_name = thisWindowPlayer;

	}else if(playerCount === 1 && gameState.playerOneJoined) {
		// If number of players = 1, take name as player 2 
		player_2_Name = $("#userName").val();
		// Preparing player1 data to pass to database
		var playerData = {
			name: player_2_Name,
			wins: 0,
			losses: 0	
		}
		// Storing current window player in variable thisWindowPlayer to display customized messages
		thisWindowPlayer = player_2_Name;
		// Storing player 1 db reference in variable
		player2Ref = database.ref("players/2");
		// Creating new player in database and passing player data to it
		player2Ref.set(playerData);
		// Listening to disconnection of player 2 and removing from db
		player2Ref.onDisconnect().remove();

	}else if(playerCount === 1 && !gameState.playerOneJoined) {
		// If number of players = 1, take name as player 2 
		player_1_Name = $("#userName").val();
		// Preparing player1 data to pass to database
		var playerData = {
			name: player_1_Name,
			wins: 0,
			losses: 0	
		}
		// Storing current window player in variable thisWindowPlayer to display customized messages
		thisWindowPlayer = player_1_Name;
		// Storing player 1 db reference in variable
		player1Ref = database.ref("players/1");
		// Creating new player in database and passing player data to it
		player1Ref.set(playerData);
		// Listening to disconnection of player 2 and removing from db
		player1Ref.onDisconnect().remove();
	}
	// Hide input form
	$(".displayBeforeStart").hide();
});

database.ref("/").on("value", function(snapshot) {

	// Getting playerCount from database
	playerCount = snapshot.child("players").numChildren();
	// Declaring variables for player 1 and player 2 ref snapshots
	var player1Snapshot = snapshot.child("players").child("1");
	var player2Snapshot = snapshot.child("players").child("2");
	// Getting player names from database
	player_1_Name = player1Snapshot.child("name").val();
	player_2_Name = player2Snapshot.child("name").val();

	if(playerCount === 1 && player_1_Name !== null) {
		gameState.playerOneJoined = true;
		gameState.playerTwoJoined = false;
		gameState.gameInProgress = false;
		gameState.playerOneMadeChoice = false;
		gameState.playerTwoMadeChoice = false;
	}else if(playerCount === 2 && player_2_Name !== null) {
		gameState.playerOneJoined = true;
		gameState.playerTwoJoined = true;
	}else if(playerCount === 1 && player_1_Name === null) {
		gameState.playerOneJoined = false;
		gameState.playerTwoJoined = true;
		//Below three lines are resets for special case of player 1 disconnect
		gameState.gameInProgress = false;
		gameState.playerOneMadeChoice = false;
		gameState.playerTwoMadeChoice = false;
		
	}else if(playerCount === 1 && player_2_Name !== null) {
		gameState.playerOneJoined = false;
		gameState.playerTwoJoined = true;
		//Below three lines are resets for special case of player 1 disconnect
		gameState.gameInProgress = false;
		gameState.playerOneMadeChoice = false;
		gameState.playerTwoMadeChoice = false;
	}
	// Getting player 1 and 2 choice data
	player_1_Choice = player1Snapshot.child("choice").val();
	player_2_Choice = player2Snapshot.child("choice").val();


	// Determining player one and two made choice for game state when game in progress
	// Game was kicked to progress when player 2 joined previously
	if(gameState.gameInProgress) {
		gameState.playerOneMadeChoice = (player_1_Choice !== null);
		gameState.playerTwoMadeChoice = (player_2_Choice !== null);
		// Getting player 1 and 2 wins and loss data when in progress
		player_1_Wins = player1Snapshot.child("wins").val();
		player_1_Wins = (player_1_Wins === null) ? 0 : player_1_Wins;
		player_1_Losses = player1Snapshot.child("losses").val();
		player_1_Losses = (player_1_Losses === null) ? 0 : player_1_Losses;
		player_2_Wins = player2Snapshot.child("wins").val();
		player_2_Wins = (player_2_Wins === null) ? 0 : player_2_Wins;
		player_2_Losses = player2Snapshot.child("losses").val();
		player_2_Losses = (player_2_Losses === null) ? 0 : player_2_Losses;
	}
	// Geting turns from database
	turns = snapshot.child("turns").val();

	/*
	* Messages to be displayed on both windows are done in onValue() function
	* Personalized messages displayed here. eg.,
	* Display name of player 1 in leftSidePanel
	* If thisWindowPlayer is player 1, display playerMessage "Hi name. You are player 1."
	*/
	if(gameState.playerOneJoined) {
		if(thisWindowPlayer === player_1_Name) {
			$("#playerMessage").html("Hi " + player_1_Name + ". You are Player 1.");
		}
		//Display Player 1 details on all windows
		$("#player_1_Name").html(player_1_Name);
		$("#gameStat1").hide();
		if(!gameState.playerTwoJoined) {
			$("#gameStat2").show();
			$("#player_2_Name").empty();
			$("#gameMessage").empty();
			$(".choices").hide();
		}
		// Setting disconnectedPlayerName as this player name for future use
		disconnectedPlayer_1_name = thisWindowPlayer;	
	}else {
		$("#playerMessage").empty();
	}

	if(gameState.playerTwoJoined) {
		if(thisWindowPlayer === player_2_Name) {
			$("#playerMessage").html("Hi " + player_2_Name + ". You are Player 2.");
		}
		//Display Player 2 details on all windows
		$("#player_2_Name").html(player_2_Name);
		$("#gameStat2").hide();
		// Setting disconnectedPlayerName as this player name for future use
		disconnectedPlayer_2_name = thisWindowPlayer;

		//Special condition where Player 1 disconnects and we have a player 2
		if(!gameState.playerOneJoined) {
			$("#gameStat1").show();
			$("#player_1_Name").empty();
			$("#gameMessage").empty();
			if(thisWindowPlayer === player_2_name) {
				disconnectData = {
					chatAuthor : disconnectedPlayer_1_name,
					timeStamp : firebase.database.ServerValue.TIMESTAMP,
					comment : " disconnected"
				}
				database.ref("/chats").push(disconnectData);
			}
		}
	}

	// If two players joined
	if(gameState.playerOneJoined && gameState.playerTwoJoined) {
		//Handle Guest window condition when two players already joined
		if(thisWindowPlayer === "Guest") {
			$(".displayBeforeStart").hide();
			$("#gameMessage").html("A game is in progress. You may wait until they're done playing or come back later.");
		}else {
			//If not Guest or rather if they are the players
			if(!gameState.gameInProgress && !gameState.playerOneMadeChoice && !gameState.playerTwoMadeChoice) {
				
				//Gather condition when wins are updated so losses can be updated accordingly
				//This condition was added during the end of coding phase because wins and losses wont
				//update sequentially
				if(gameState.playerOneWinUpdated || gameState.playerTwoWinUpdated) {
					if(gameState.playerOneWinUpdated) {
						gameState.playerOneWinUpdated = false;
						++player_2_Losses;
						database.ref("/players/2/losses").set(player_2_Losses);
					}else if(gameState.playerTwoWinUpdated) {
						gameState.playerTwoWinUpdated = false;
						++player_1_Losses;
						database.ref("/players/1/losses").set(player_1_Losses);
					}
				}else {
					//This else block is the normal condition that kickstarts a new game.
					gameState.gameInProgress = true;
					// Set turn 0 in database indicating game begun and player 1 can choose
					turns = 0;
					// Kickstart game from the player 2 window only
					if(thisWindowPlayer === player_2_Name) {
						database.ref("/turns").set(turns);
					}
					database.ref("/turns").onDisconnect().remove();	
				}		
			}else if(gameState.gameInProgress && !gameState.playerOneMadeChoice && !gameState.playerTwoMadeChoice){
				// This means game is in progress.
				// Now we have to show choices for players
				if(turns === 0) {
					if(thisWindowPlayer === player_1_Name) {
						$("#gameMessage").html("<p>It's your turn.</p>");
						$(".leftSidePanel> .choices").show();
					}
					if(thisWindowPlayer === player_2_Name) {
						$("#gameMessage").html("<p>Waiting for " + player_1_Name + " to choose.</p>");
					}
					$(".leftSidePanel").addClass('currentPlayer');
					$(".rightSidePanel").removeClass('currentPlayer');
				}
			}

			if(gameState.playerOneMadeChoice && turns === 0 && !gameState.playerTwoMadeChoice) {
				// If player one made the choice and if current window is player one update turns to 1
				if(thisWindowPlayer === player_1_Name) {
					// Update turns and set in database
					turns = 1;
					database.ref("/turns").set(turns);
				}
			}else if(gameState.playerOneMadeChoice && turns === 1 && !gameState.playerTwoMadeChoice) {
				// Do display work for both windows as this means turns is updated to 1
				// And player 2 should also be presented to choose
				if(thisWindowPlayer === player_2_Name) {
					$("#gameMessage").html("<p>It's your turn.</p>");
					$(".rightSidePanel> .choices").removeClass("chosen").attr('disabled', false).show();
				}
				if(thisWindowPlayer === player_1_Name) {
					$("#gameMessage").html("<p>Waiting for " + player_2_Name + " to choose.</p>");
				}
				$(".leftSidePanel").removeClass('currentPlayer');
				$(".rightSidePanel").addClass('currentPlayer');
			}

			if(gameState.playerTwoMadeChoice && turns === 1) {
				// If player two made the choice and if current window is player two update turns to 2
				if(thisWindowPlayer === player_2_Name) {
					// Update turns and set in database
					turns = 2;
					database.ref("/turns").set(turns);
				}
			} else if(gameState.playerTwoMadeChoice && turns === 2){
				// This thing should happen in both windows
				// Calculate the outcome of game
				// Remove current player style
				$(".leftSidePanel").removeClass('currentPlayer');
				$(".rightSidePanel").removeClass('currentPlayer');
				
				// Validate choices and rps game
				rpsGameValidate(player_1_Choice,player_2_Choice);
				// Resetting player 1 and 2 choices
				$(".choices").removeClass("chosen").attr("disabled", false);
				console.log("WINNER COMPUTED: " + winner);
				gameState.gameInProgress = false;
				gameState.playerOneMadeChoice = false;
				gameState.playerTwoMadeChoice = false;

				if(winner === player_1_Name && !gameState.playerOneWinUpdated) {
					gameState.playerOneWinUpdated = true;
				}
				if(winner === player_2_Name && !gameState.playerTwoWinUpdated) {
					gameState.playerTwoWinUpdated = true;
				}
				//Note that there are so many DB calls but
				//you dont need to worry about any other critical
				//DB calls getting called in value callback as everything is
				//controlled with the help of gamestate flags.

				// Giving Player 1 the honors of doing db updates and resetting game
				if(thisWindowPlayer === player_1_Name) {
					// Update turns and set in db
					turns = 0;
					database.ref("/turns").set(turns);
					// Removing choices from db for new game
					database.ref("/players/1/choice").remove();
					database.ref("/players/2/choice").remove();

					if(winner === player_1_Name) {
						++player_1_Wins;
						database.ref("/players/1/wins").set(player_1_Wins);
					}else if(winner === player_2_Name) {
						++player_2_Wins;
						database.ref("/players/2/wins").set(player_2_Wins);
					}
				}
			}
		}
	}
});


// On click of rock, paper or scissors game choices
$(".choices").on("click", function() {

	// Checking if player 1 chose or player 2
	// Player 1 is housed in the leftSidePanel
	if($(this).parent().hasClass('leftSidePanel')) {
		// Hide the choices options
		$(".leftSidePanel> .choices").hide();
		// Getting choice chosen by player 1
		player_1_Choice = $(this).data('choice');
		gameState.playerOneMadeChoice = true;
		// Adding choice to database
		database.ref("/players/1/choice").set(player_1_Choice);
	}else if($(this).parent().hasClass('rightSidePanel')) {
		// Hide choices
		$(".rightSidePanel> .choices").hide();
		// Getting player 2's choice
		player_2_Choice = $(this).data('choice');
		gameState.playerTwoMadeChoice = true;
		// Adding player 2 choice to the database
		database.ref("/players/2/choice").set(player_2_Choice);
	}
	// Show only the chosen one
	$(this).show();
	// Add class to display choice
	$(this).addClass("chosen").attr('disabled', true);
});

// RPS Game logic
function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {
		winner = "";
	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {
		winner = player_1_Name;
		
	}else {
		winner = player_2_Name;
	}
	// Display who won
	if(winner !== "") {
		$("#message").html(winner + " Wins!");
	} else {
		$("#message").html("It's a Tie!");
	}
	setTimeout(clearMessage,3000);

}

function clearMessage() {
	$("#message").html("");
}

// Chat functionality
$("#postComment").on("click", function(event){
	event.preventDefault();
	var comment = $("#comment").val();
	// Chat data to be pushed to db
	chatData = {
		userName: thisWindowPlayer,
		comment: comment,
		timeStamp: firebase.database.ServerValue.TIMESTAMP
	}
	// Pushing chat data. Chat history saved in database.
	database.ref("/chats").push(chatData);
	$("#comment").val("");
});

// Taking last 7 chats from db. 
database.ref("/chats").orderByChild("timeStamp").limitToLast(7).on("child_added", function(childSnapshot) {
	chatAuthor = childSnapshot.val().userName;
	comment = childSnapshot.val().comment;
	time = moment(childSnapshot.val().timeStamp,'x').format("MM/DD/YY hh:mm A");
	// Retrieving chatData to display in chat window
	$("#chatWindow").append("<p><span class='chatUserInfo'>" + chatAuthor + " @ " + time + ": </span><br>" + comment + "</p>");
	$("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
})


// if(thisWindowPlayer === player_1_Name) {
					// 	disconnectData = {
					// 		chatAuthor : "System",
					// 		timeStamp : moment(firebase.database.ServerValue.TIMESTAMP, 'x').format("MM/DD/YY hh:mm A"),
					// 		comment : player_1_Name + "Disconnected"
					// 	}
					// }else if(thisWindowPlayer === player_2_Name) {
					// 	disconnectData = {
					// 		chatAuthor : "System",
					// 		timeStamp : moment(firebase.database.ServerValue.TIMESTAMP, 'x').format("MM/DD/YY hh:mm A"),
					// 		comment : player_2_Name + "Disconnected"
					// 	}
					// }
					// database.ref("/chats/disconnected").onDisconnect().set(disconnectData);
