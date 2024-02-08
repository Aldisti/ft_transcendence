import Game from "/games/pong2d/Game.js"

let game;

function animate(currentTime)
{
	requestAnimationFrame(animate);

	if (!game.positionUpdated)
		game.ball.calculatePosition();
	game.positionUpdated = false;
	game.draw();
}


export default function setupGame(config){
	game = new Game(config)
	animate()
	return game;
}