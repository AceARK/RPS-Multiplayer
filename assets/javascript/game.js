var playerCount = 0;
var player_1_Score = 0; 
var player_2_Score = 0; 
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";

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

	console.log("Player 1 score: " + player_1_Score + " Player 2 score " + player_2_Score);

	playerCount = snapshot.child("players").numChildren();
	console.log("Player Count from DB: " + playerCount);
	player_1_Choice = snapshot.child("players").child("1").child("choices").val();
	console.log("Player 1 choice from db: " + player_1_Choice);
	player_2_Choice = snapshot.child("players").child("2").child("choices").val();
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

		++player_1_Score;
		console.log("player_1_Score" + player_1_Score);

		// Setting wins in database to updated player1Score
		database.ref("/players/1/wins").set(player_1_Score);

	}else {
		++player_2_Score;
		console.log("player_2_Score" + player_2_Score);

		// Setting wins in database to updated player2Score		
		database.ref("/players/2/wins").set(player_2_Score);

	}

	// Resetting player choices after each round
	resetPlayerChoices();

}

// Function to reset player choices at the end of each round
function resetPlayerChoices() {

	// setting choices to null
	player_1_Choice = null;
	player_2_Choice = null;

	// Updating to database
	database.ref("/players/1").child("choices").remove();
	database.ref("/players/2").child("choices").remove();

}

// On click of rock, paper or scissors
$(".choices").on("click", function() {
	console.log("player1 score: " + player_1_Score + " player2 score: " + player_2_Score);
	if($(this).parent().hasClass('leftSidePanel')) {
		player_1_Choice = $(this).data('choice');

		// Add choice to database
		database.ref("/players/1/choices").set(player_1_Choice);

	}else {
		player_2_Choice = $(this).data('choice');

		database.ref("/players/2/choices").set(player_2_Choice);
	}


	if((player_1_Choice !== null) && (player_2_Choice !== null)) {
		rpsGameValidate(player_1_Choice,player_2_Choice);
	}

})