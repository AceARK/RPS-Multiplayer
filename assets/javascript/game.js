var playerCount = 0;
var player_1_Wins = 0; 
var player_2_Wins = 0; 
var player_1_Losses = 0; 
var player_2_Losses = 0; 
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";
var turns = 0;

var config = {
    apiKey: "AIzaSyALngADSiFUCFCzIpx8eOoz_qByHqgAtQI",
    authDomain: "rps-multiplayer-b232b.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-b232b.firebaseio.com",
    storageBucket: "rps-multiplayer-b232b.appspot.com",
    messagingSenderId: "508808037478"
  };

firebase.initializeApp(config);

database = firebase.database();

// Checking playerCount in database
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
});

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

		$("#player_1_Name").html(player_1_Name);
	// refPath = "/players/1";

	}else {
		// Take player as player2
		player_2_Name = $("#userName").val();

		// Preparing player2 data to pass to database
		var playerData = {

			name: player_2_Name,
			wins: 0,
			losses: 0
			
		}

		$("#player_2_Name").html(player_2_Name);

	}

	++playerCount;
	console.log("Incremented Player Count: " + playerCount);
	console.log("PlayerCount to push: " + playerCount);
	playerCountToPush = playerCount.toString();

	// Creating new player in database and passing player data to it
	database.ref("players/" + playerCountToPush).set(playerData);

	// Hiding start components and enabling game choices
	$(".displayBeforeStart").hide();
	$(".choices").attr('disabled', false);
})

// RPS Game function
function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {

		console.log("Tie");

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {

		++player_1_Wins;
		++player_2_Losses;
		console.log("player_1_Wins " + player_1_Wins + " player 2 loss: " + player_2_Losses);

	}else {
		++player_2_Wins;
		++player_1_Losses;
		console.log("player_2_Score " + player_2_Wins + " player 1 loss: " + player_1_Losses);

	}

	// Call to set wins/losses to database
	setWinsAndLossesInDatabase();

	// Resetting player choices after each round
	// resetPlayerChoices();

	// Set turns to 0 for new round
	turns = 0;
	database.ref("/turns").set(turns);

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

// Function to reset player choices at the end of each round
// function resetPlayerChoices() {

// 	// setting choices to null
// 	player_1_Choice = null;
// 	player_2_Choice = null;

// 	// Updating to database
// 	// database.ref("/players/1").child("choice").remove();
// 	// database.ref("/players/2").child("choice").remove();

// }

// On click of rock, paper or scissors
$(".choices").on("click", function() {

	// Increment turns and update to database
	++turns;
	database.ref("/turns").set(turns);

	if($(this).parent().hasClass('leftSidePanel')) {
		player_1_Choice = $(this).data('choice');

		// Add choice to database
		database.ref("/players/1/choice").set(player_1_Choice);

	}else {
		player_2_Choice = $(this).data('choice');

		database.ref("/players/2/choice").set(player_2_Choice);
	}

	// Evaluate only if both players have chosen i.e. turns = 2
	if(turns === 2) {
		// if((player_1_Choice !== null) && (player_2_Choice !== null)) {
			rpsGameValidate(player_1_Choice,player_2_Choice);
		// }
	}

})