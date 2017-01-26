var player1Score, player2Score, tie = 0;
var player1Choice, player2Choice = "";

function rpsGameValidate(player1Choice, player2Choice) {
	if (player1Choice === player2Choice) {

		tie ++;

	}else if (((player1Choice === 'rock') && (player2Choice === 'scissors')) ||
			   ((player1Choice === 'paper') && (player2Choice === 'rock')) ||
			   ((player1Choice === 'scissors') && (player2Choice === 'paper'))) {

		player1Score ++;

	}else {
		player2Score ++;
	}
}