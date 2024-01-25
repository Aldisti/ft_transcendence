import Game from "/games/pong2d/Game.js"

let previousTime = window.performance.now();
let frameInterval = 1000 / 60;
let game;

// function animate()
// {
// 	requestAnimationFrame(animate);
// 	const now = window.performance.now();
// 	const deltaTime = now - previousTime;
// 	if (deltaTime < frameInterval) {
// 		return;
// 	}
// 	if (!game.positionUpdated)
// 		game.ball.calculatePosition();
// 	game.positionUpdated = false;
// 	game.draw();

// 	previousTime = now;
// }

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
}