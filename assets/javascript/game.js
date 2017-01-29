var playerCount = 0;
var thisWindowPlayer = "";
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
		thisWindowPlayer = player_1_Name;

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
});

database.ref().on("value", function(snapshot) {
	// Not displaying player name input and start button if 2 players already exist
	// P.N. - Player count max val = 2 since this game only handles 2 players
	// P.N. - Future version will include multiple players being paired to play and handling odd number of players
	if(playerCount === 2 && thisWindowPlayer == "") {
		$("#displayBeforeStart").hide();
		$("#gameMessage").html("Two players are already playing. You may wait until they finish playing or come back later.");
	}
	// Getting playerCount from database
	playerCount = snapshot.child("players").numChildren();

});