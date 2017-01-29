var playerCount = 0;
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
	// Getting playerCount from database
	playerCount = snapshot.child("players").numChildren();
	// Declaring variables for player 1 and player 2 ref snapshots
	var player1Snapshot = snapshot.child("players").child("1");
	var player2Snapshot = snapshot.child("players").child("2");
	// Getting player names from database
	player_1_Name = player1Snapshot.child("name").val();
	player_2_Name = player2Snapshot.child("name").val();

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

	// Messages to be displayed on both windows are done in onValue() function
	// Display name of player 1 in leftSidePanel
	// If thisWindowPlayer is player 1, display playerMessage "Hi name. You are player 1."
	if(playerCount === 1) {
		// $("#gameMessage").hide();
		if(thisWindowPlayer === player_1_Name) {
			$("#playerMessage").html("Hi " + player_1_Name + ". You are Player 1.");
		}
	}else if(playerCount === 2) {
		// $("#gameMessage").hide();
		if(thisWindowPlayer === player_2_Name) {

			$("#playerMessage").html("Hi " + player_2_Name + ". You are Player 2.");

		}
		// For anybody logging in after 2 players exist, disable input form, and display message
		// P.N. - Player count max val = 2 since this game only handles 2 players
		// P.N. - Future version will include multiple players being paired to play and handling odd number of players
		if(thisWindowPlayer === "Guest") {
			$(".displayBeforeStart").hide();
			$("#gameMessage").html("A game is in progress. You may wait until they finish playing or come back later.");
		}

	}

});