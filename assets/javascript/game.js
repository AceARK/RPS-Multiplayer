var playerCount, player_1_Score, player_2_Score, tie = 0;
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


// To do - Code to get /player.numChildren from database to get playerCount, set playerCount to that value

$("#startButton").on("click", function() {

	// Checking playerCount in database
	database.ref("/players").once("value", function(snapshot) {

		playerCount = snapshot.numChildren();
		console.log(playerCount);
	});

	// Code to distinguish player1 and player2
	if(playerCount < 1) {

		// Take player as player2
		player_2_Name = $("#userName").val();

		// Preparing player2 data to pass to database
		var playerData = {

			name: player_2_Name,
			wins: 0,
			losses: 0
			
		}

		refPath = "/players/2";

	}else {
		
		// If number of players = 1, take name as player 1 else player 2
		player_1_Name = $("#userName").val();

		// Preparing player1 data to pass to database
		var playerData = {

			name: player_1_Name,
			wins: 0,
			losses: 0
			
		}
		
		refPath = "/players/1";
	}

	// Creating new player in database and passing player data to it
	database.ref(refPath).set(playerData);


	$("#player_1_Name").html(player_1_Name);

	// Hiding start components and enabling game choices
	$(".displayBeforeStart").hide();
	$(".choices").attr('disabled', false);
})

function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {

		tie ++;
		console.log("Tie" + tie);

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {

		player_1_Score ++;
		console.log("player_1_Score" + player_1_Score);

	}else {
		player_2_Score ++;
		console.log("player_2_Score" + player_2_Score);
	}
}

$(".choices").on("click", function() {
	if($(this).parent().hasClass('leftSidePanel')) {
		player_1_Choice = $(this).data('choice');
	}else {
		player_2_Choice = $(this).data('choice');
	}
	// console.log("player 1 " + player_1_Choice + " player 2 " + player_2_Choice);

	if((player_1_Choice !== "") && (player_2_Choice !== "")) {
		rpsGameValidate(player_1_Choice,player_2_Choice);
		player_1_Choice === "";
		player_2_Choice === "";
	}
	// console.log($(this).data('choice'));
})