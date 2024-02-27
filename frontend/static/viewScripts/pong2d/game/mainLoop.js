import Game from "/viewScripts/pong2d/game/Game.js"

let game;
let animationId

function animate(currentTime)
{
	animationId = window.requestAnimationFrame(animate);
	if (localStorage.getItem("stop") == "true"){
		window.cancelAnimationFrame(animationId);
		localStorage.setItem("stop", "false");
	}

	if (!game.positionUpdated)
		game.ball.calculatePosition();
	game.positionUpdated = false;
	game.draw();
}


export default function setupGame(config){
	game = new Game(config)
	localStorage.setItem("stop", "false")
	animate()
	return game;
}