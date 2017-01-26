var player_1_Score, player_2_Score, tie = 0;
var player_1_Choice, player_2_Choice = "";
var player_1_Name, player_2_Name = "";

$("#startButton").on("click", function() {
	// If number of players = 1, take name as player 1 else player 2
	player_1_Name = $("#userName").val();
	$("#player_1_Name").html(player_1_Name);

	$(".displayBeforeStart").hide();
	$(".choices").attr('disabled', false);
})

function rpsGameValidate(player_1_Choice, player_2_Choice) {
	if (player_1_Choice === player_2_Choice) {

		tie ++;

	}else if (((player_1_Choice === 'rock') && (player_2_Choice === 'scissors')) ||
			   ((player_1_Choice === 'paper') && (player_2_Choice === 'rock')) ||
			   ((player_1_Choice === 'scissors') && (player_2_Choice === 'paper'))) {

		player_1_Score ++;

	}else {
		player_2_Score ++;
	}
}

$(".choices").on("click", function() {
	if($(this).parent().hasClass('leftSidePanel')) {
		player_1_Choice = $(this).data('choice');
	}else {
		player_2_Choice = $(this).data('choice');
	}
	console.log("player 1 " + player_1_Choice + " player 2 " + player_2_Choice);
	// console.log($(this).data('choice'));
})