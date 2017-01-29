var playerCount = 0;
var player_1_Wins = 0; 
var player_2_Wins = 0; 
var player_1_Losses = 0; 
var player_2_Losses = 0; 
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";
var thisWindowPlayer = "Guest";
var turns = 0;
// Firebase configuration
var config = {
    apiKey: "AIzaSyALngADSiFUCFCzIpx8eOoz_qByHqgAtQI",
    authDomain: "rps-multiplayer-b232b.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-b232b.firebaseio.com",
    storageBucket: "rps-multiplayer-b232b.appspot.com",
    messagingSenderId: "508808037478"
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

	}else if(playerCount === 1) {
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
		// Setting turns = 0, to begin game and pushing to database
		turns = 0;
		database.ref("/turns").set(turns);
	}
	// Hide input form
	$(".displayBeforeStart").hide();
});

database.ref().on("value", function(snapshot) {
	// Geting turns from database
	turns = snapshot.child("turns").val();
	// Getting playerCount from database
	playerCount = snapshot.child("players").numChildren();
	// Declaring variables for player 1 and player 2 ref snapshots
	var player1Snapshot = snapshot.child("players").child("1");
	var player2Snapshot = snapshot.child("players").child("2");
	// Getting player names from database
	player_1_Name = player1Snapshot.child("name").val();
	player_2_Name = player2Snapshot.child("name").val();
	// Getting player 1 and 2 choice data
	player_1_Choice = player1Snapshot.child("choice").val();
	player_2_Choice = player2Snapshot.child("choice").val();

	// Gather player name from database if exists, and display regardless of playerCount or turns
	// If player1 exists, remove "Waiting for player 1" from both windows
	if(player_1_Name !== null) {
		$("#player_1_Name").html(player_1_Name);
		$("#gameStat1").hide();
	}
	if(player_2_Name !== null) {
		$("#player_2_Name").html(player_2_Name);
		$("#gameStat2").hide();
	}
	// If less than 2 players exist, remove turns
	if(playerCount < 2) {
		database.ref("/turns").remove();
	}

	/*
	* Messages to be displayed on both windows are done in onValue() function
	* Personalized messages displayed here. eg.,
	* Display name of player 1 in leftSidePanel
	* If thisWindowPlayer is player 1, display playerMessage "Hi name. You are player 1."
	*/
	if(playerCount === 1) {
		// $("#gameMessage").hide();
		if(thisWindowPlayer === player_1_Name) {
			$("#playerMessage").html("Hi " + player_1_Name + ". You are Player 1.");
		}
	}else if(playerCount === 2) {
		// $("#gameMessage").hide();
		if(thisWindowPlayer === player_2_Name) {

			$("#playerMessage").html("Hi " + player_2_Name + ". You are Player 2.");

			if(turns === 0) {

				$("#gameMessage").html("<p>Waiting for " + player_1_Name + " to choose.</p>");

			}else if(turns === 1) {

				$("#gameMessage").html("<p>It's your turn.</p>");

				$(".rightSidePanel> .choices").removeClass("chosen").attr('disabled', false).show();

			}
		/*	
		* For anybody logging in after 2 players exist, disable input form, and display message
		* P.N. - Player count max val = 2 since this game only handles 2 players
		* P.N. - Future version will include multiple players being paired to play and handling odd number of players
		*/
		}else if(thisWindowPlayer === "Guest") {
			$(".displayBeforeStart").hide();
			$("#gameMessage").html("A game is in progress. You may wait until they're done playing or come back later.");
		
		}else if(thisWindowPlayer === player_1_Name) {

			if(turns === 0) {

				$("#gameMessage").html("<p>It's your turn.</p>");

				$(".leftSidePanel> .choices").show();

			}else if(turns === 1) {

				$("#gameMessage").html("<p>Waiting for " + player_2_Name + " to choose.</p>");

			}

		}

		/*
		* Code that runs irrespective of user window
		*/
		if(turns === 0) {

			$(".leftSidePanel").addClass('currentPlayer');
			$(".rightSidePanel").removeClass('currentPlayer');

		}else if(turns === 1) {

			$(".leftSidePanel").removeClass('currentPlayer');
			$(".rightSidePanel").addClass('currentPlayer');

		// If both players have chosen, 	
		}else if(turns === 2) {
			// Remove current player style
			$(".leftSidePanel").removeClass('currentPlayer');
			$(".rightSidePanel").removeClass('currentPlayer');
			// Update turns and set in db
			turns = 0;
			database.ref("/turns").set(turns);
			// Validate choices and rps game
			rpsGameValidate(player_1_Choice,player_2_Choice);
			// Resetting player 1 and 2 choices
			$(".choices").removeClass("chosen").attr("disabled", false);
			// Removing choices from db for new game
			database.ref("/players/1/choice").remove();
			database.ref("/players/2/choice").remove();
			// Run RPS game logic
			if(winner === player_1_Name) {

				++player_1_Wins;
				++player_2_Losses;
				database.ref("/players/1/wins").set(player_1_Wins);
				database.ref("/players/2/losses").set(player_2_Losses);

			}else if(winner === player_2_Name) {

				++player_2_Wins;
				++player_1_Losses;
				database.ref("/players/1/losses").set(player_1_Losses);
				database.ref("/players/2/wins").set(player_2_Wins);
			}
			if(winner !== "") {
				// Display who won
				$("#message").html(winner + " Wins!");
			}
		}

	}

});

// On click of rock, paper or scissors game choices
$(".choices").on("click", function() {
	// Checking if player 1 chose or player 2
	// Player 1 is housed in the leftSidePanel
	if($(this).parent().hasClass('leftSidePanel')) {
		// Getting choice chosen by player 1
		player_1_Choice = $(this).data('choice');
		// Adding choice to database
		database.ref("/players/1/choice").set(player_1_Choice);
		// Update turns and set in database
		turns = 1;
		database.ref("/turns").set(turns);
		// Hide choices
		$(".leftSidePanel> .choices").hide();

	}else if($(this).parent().hasClass('rightSidePanel')) {
		// Getting player 2's choice
		player_2_Choice = $(this).data('choice');
		// Adding player 2 choice to the database
		database.ref("/players/2/choice").set(player_2_Choice);
		// Update turns and set in database
		turns = 2;
		database.ref("/turns").set(turns);
		// Hide choices
		$(".rightSidePanel> .choices").hide();
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
		$("#message").html("Tie");

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {
		winner = player_1_Name;
		
	}else {
		winner = player_2_Name;
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
})

