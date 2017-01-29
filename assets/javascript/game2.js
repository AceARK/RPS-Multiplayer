var playerCount = 0;
var player_1_Wins = 0; 
var player_2_Wins = 0; 
var player_1_Losses = 0; 
var player_2_Losses = 0; 
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";
var turns;
var thisWindowPlayer = "";

var config = {
    apiKey: "AIzaSyALngADSiFUCFCzIpx8eOoz_qByHqgAtQI",
    authDomain: "rps-multiplayer-b232b.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-b232b.firebaseio.com",
    storageBucket: "rps-multiplayer-b232b.appspot.com",
    messagingSenderId: "508808037478"
  };

firebase.initializeApp(config);

database = firebase.database();

$(".choices").hide();

// On click of Start Button
$("#startButton").on("click", function(event) {

	event.preventDefault();

	// Code to distinguish player1 and player2
	if(playerCount < 1) {
		// If number of players = 1, take name as player 1 else player 2
		player_1_Name = $("#userName").val();

		// Preparing player1 data to pass to database
		var playerData = {

			name: player_1_Name,
			wins: 0,
			losses: 0
			
		}

		// Storing player 1 name as current window player
		thisWindowPlayer = player_1_Name;

		// Storing player 1 db reference in variable
		player1Ref = database.ref("players/1");

		// Creating new player in database and passing player data to it
		database.ref("players/1").set(playerData);

		// Listening to disconnection of player 1 and removing from db
		player1Ref.onDisconnect().remove();

	}else {
		// Take player as player2
		player_2_Name = $("#userName").val();

		// Preparing player2 data to pass to database
		var playerData = {

			name: player_2_Name,
			wins: 0,
			losses: 0
			
		}

		// Storing player 1 name as current window player
		thisWindowPlayer = player_2_Name;

		// Storing player 2 db reference in variable
		player2Ref = database.ref("/players/2");

		// Creating new player in database and passing player data to it
		player2Ref.set(playerData);

		// Listening to disconnection of player 2 and removing from db
		player2Ref.onDisconnect().remove();

		// Setting and adding turns to database
		turns = 0;
		database.ref("/turns").set(turns);
	}

	// Increment player count
	++playerCount;

	// Hiding start components and enabling game choices
	$(".displayBeforeStart").hide();
	$(".choices").attr('disabled', false);
});

// On click of rock, paper or scissors game choices
$(".choices").on("click", function() {

	if($(this).parent().hasClass('leftSidePanel')) {
		// Get choice
		player_1_Choice = $(this).data('choice');
		// Add choice to database
		database.ref("/players/1/choice").set(player_1_Choice);
		turns = 1;

	}else {
		// Get choice
		player_2_Choice = $(this).data('choice');
		// Add choice to the database
		database.ref("/players/2/choice").set(player_2_Choice);
		turns = 2;
	}

	database.ref("/turns").set(turns);

})

/*
To Do After -
- Player disconnect configuration.
- Chat functionality.
*/

// Display/Set variables on change in database
database.ref().on("value", function(snapshot) {

	// Geting turns snapshot
	turns = snapshot.child("turns").val();
	// Getting player count snapshot
	playerCount = snapshot.child("players").numChildren();
	// Declaring variables for player 1 and player 2 ref snapshots
	var player1Snapshot = snapshot.child("players").child("1");
	var player2Snapshot = snapshot.child("players").child("2")
	// Getting player 1 and 2 name data
	player_1_Name = player1Snapshot.child("name").val();
	player_2_Name = player2Snapshot.child("name").val();
	// Getting player 1 and 2 choice data
	player_1_Choice = player1Snapshot.child("choice").val();
	player_2_Choice = player2Snapshot.child("choice").val();
	// Getting player 1 and 2 wins and loss data
	// player_1_Wins = player1Snapshot.child("wins").val();
	// player_1_Losses = player1Snapshot.child("losses").val();
	// player_2_Wins = player2Snapshot.child("wins").val();
	// player_2_Losses = player2Snapshot.child("losses").val();

	if(playerCount === 1) {

		$("#gameStat1").hide();

		if(player_1_Name == thisWindowPlayer) {

			$("#playerMessage").html("Hi " + player_1_Name + ". You are Player 1.");

		}

	}else if(playerCount === 2) {

		$("#gameStat2").hide();

		if(player_2_Name == thisWindowPlayer) {

			$("#playerMessage").html("Hi " + player_2_Name + ". You are Player 2.");

			if(turns === 0) {

				$("#gameMessage").html("<p>Waiting for " + player_1_Name + " to choose.</p>");

			}else if(turns === 1) {

				$("#gameMessage").html("<p>It's your turn.</p>");

				$(".rightSidePanel> .choices").show();

			}
			
		}

		if(player_1_Name == thisWindowPlayer) {

			if(turns === 0) {

				$("#gameMessage").html("<br>It's your turn.</p>");

				$(".leftSidePanel> .choices").show();

			}else if(turns === 1) {

				$("#gameMessage").html("<br>Waiting for " + player_2_Name + " to choose.</p>");

			}

		}

		if(turns === 0) {

			$(".leftSidePanel").addClass('currentPlayer');
			$(".rightSidePanel").removeClass('currentPlayer');

		}else if(turns === 1) {

			$(".leftSidePanel").removeClass('currentPlayer');
			$(".rightSidePanel").addClass('currentPlayer');

		}

	
	}

	// Gather player name from database if exists, and display
	if(player_1_Name !== null) {
		$("#player_1_Name").html(player_1_Name);
	}
	if(player_2_Name !== null) {
		$("#player_2_Name").html(player_2_Name);
	}

	// If both players have chosen, 
	if(turns === 2) {

		$(".leftSidePanel").removeClass('currentPlayer');
		$(".rightSidePanel").removeClass('currentPlayer');
		turns = 0;
		database.ref("/turns").set(turns);
		rpsGameValidate(player_1_Choice,player_2_Choice);
		if(player_1_Name == thisWindowPlayer) {
			// Run RPS game logic
			// rpsGameValidate(player_1_Choice,player_2_Choice);
			if(winner === player_1_Name) {

				++player_1_Wins;
				++player_2_Losses;
				database.ref("/players/1/wins").set(player_1_Wins);
				database.ref("/players/2/losses").set(player_2_Losses);
			}
		}

		if(player_2_Name == thisWindowPlayer) {
			// Run RPS game logic
		
			if(winner === player_2_Name) {

				++player_2_Wins;
				++player_1_Losses;
				database.ref("/players/1/losses").set(player_1_Losses);
				database.ref("/players/2/wins").set(player_2_Wins);
			}
		}
	}

}, function(errorObject) {

      //console.log("Errors handled: " + errorObject.code);

});

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
	//console.log(time);
	// Retrieving chatData to display in chat window
	$("#chatWindow").append("<p>" + chatAuthor + " @ " + time + ": <br>" + comment + "</p>");
})

// RPS Game logic
function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {
		winner = "";
		$("#message").html("Tie");

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {
		winner = player_1_Name;
		//console.log("player_1_Wins " + player_1_Wins + " player 2 loss: " + player_2_Losses);
		$("#message").html(player_1_Name + " Wins!");

	}else {
		winner = player_2_Name;
		//console.log("player_2_Score " + player_2_Wins + " player 1 loss: " + player_1_Losses);
		$("#message").html(player_2_Name + " Wins!");
	}

	setTimeout(clearMessage,4000);

}

function clearMessage() {
	$("#message").html("");
}
