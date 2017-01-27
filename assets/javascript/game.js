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
$("#startButton").on("click", function() {

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

	}else {
		// Take player as player2
		player_2_Name = $("#userName").val();

		// Preparing player2 data to pass to database
		var playerData = {

			name: player_2_Name,
			wins: 0,
			losses: 0
			
		}
		// Setting and adding turns to database
		turns = 0;
		database.ref("/turns").set(turns);
	}

	// Increment player count
	++playerCount;
	console.log("Incremented Player Count: " + playerCount);
	console.log("PlayerCount to push: " + playerCount);
	playerCountToPush = playerCount.toString();

	// Getting name of player using the current window
	thisWindowPlayer = playerData.name;

	// Creating new player in database and passing player data to it
	database.ref("players/" + playerCountToPush).set(playerData);
	
	// Hiding start components and enabling game choices
	$(".displayBeforeStart").hide();
	$(".choices").attr('disabled', false);
});

/*
To Do -
- Show only current player's game choices, hide the rest.
- On choosing option, disable other choices, and highlight/enlarge chosen.
*/

// On click of rock, paper or scissors game choices
$(".choices").on("click", function() {

	// Increment turns and update to database
	++turns;
	database.ref("/turns").set(turns);

	if($(this).parent().hasClass('leftSidePanel')) {
		// Get choice
		player_1_Choice = $(this).data('choice');
		// Add choice to database
		database.ref("/players/1/choice").set(player_1_Choice);

	}else {
		// Get choice
		player_2_Choice = $(this).data('choice');
		// Add choice to the database
		database.ref("/players/2/choice").set(player_2_Choice);
	}



	// switch(turn) {
	// 	case 0:
	// 		$("#turnMessage").html("Waiting for " player_1_Name + " to play.");
	// 		break;

	// 	case 1:
	// 		$("#turnMessage").html("Waiting for " player_2_Name + " to play.");
	// 		break;

	// 	case 2:
			
	// }

	if(turns === 2) {
		// Run RPS game logic
		rpsGameValidate(player_1_Choice,player_2_Choice);
	}

})

/*
To Do -
- Display turn info on each player's messages section.
- Update it each time an event occurs i.e. choice chosen, loss or win.
*/

/*
To Do After -
- Player disconnect configuration.
- Chat functionality.
*/

// Display/Set variables on change in database
database.ref().on("value", function(snapshot) {

	console.log("Player 1 wins: " + player_1_Wins + " Player 2 wins " + player_2_Wins);

	turns = snapshot.child("turns").val();
	console.log("turns: " + turns);
	playerCount = snapshot.child("players").numChildren();
	console.log("Player Count from DB: " + playerCount);
	player_1_Choice = snapshot.child("players").child("1").child("choice").val();
	console.log("Player 1 choice from db: " + player_1_Choice);
	player_2_Choice = snapshot.child("players").child("2").child("choice").val();
	console.log("Player 2 choice from db: " + player_2_Choice);
	player_1_Name = snapshot.child("players").child("1").child("name").val();
	player_2_Name = snapshot.child("players").child("2").child("name").val();
	console.log("Player 1 name from db: " + player_1_Name);
	console.log("Player 2 name from db: " + player_2_Name);
	console.log("This window player: " +thisWindowPlayer);

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
	
	}

	// Gather player name from database if exists, and display
	if(player_1_Name !== null) {
		$("#player_1_Name").html(player_1_Name);
	}
	if(player_2_Name !== null) {
		$("#player_2_Name").html(player_2_Name);
	}

});

// RPS Game logic
function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {

		console.log("Tie");

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {

		++player_1_Wins;
		++player_2_Losses;
		console.log("player_1_Wins " + player_1_Wins + " player 2 loss: " + player_2_Losses);
		$("#message").html(player_1_Name + " Wins!");
		// setTimeout($("#message").html(""), 2000);

	}else {
		++player_2_Wins;
		++player_1_Losses;
		console.log("player_2_Score " + player_2_Wins + " player 1 loss: " + player_1_Losses);
		$("#message").html(player_2_Name + " Wins!");
		// setTimeout($("#message").html(""), 2000);
	}

	$("#turnMessage").html("");

	// Call to set wins/losses to database
	setWinsAndLossesInDatabase();

	setTurnsAndClearChoice();

}

function setTurnsAndClearChoice() {
	// Set turns to 0 for new round
	turns = 0;
	database.ref("/turns").set(turns);
	player_1_Choice = null;
	player_2_Choice = null;
	database.ref("/player/1/choice").set(player_1_Choice);
	database.ref("/player/2/choice").set(player_2_Choice);
}

// Function to set updated wins and losses for each player
function setWinsAndLossesInDatabase() {
	// Setting updated player1 wins/losses in database
	database.ref("/players/1/wins").set(player_1_Wins);
	database.ref("/players/1/losses").set(player_1_Losses);
	// Setting updated player2 wins/losses in database	
	database.ref("/players/2/wins").set(player_2_Wins);
	database.ref("/players/2/losses").set(player_2_Losses);

}