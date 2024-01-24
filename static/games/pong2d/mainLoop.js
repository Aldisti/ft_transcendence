import Game from "/games/pong2d/Game.js"

let previousTime = window.performance.now();
let frameInterval = 1000 / 60;

let game = new Game({ 
	previousTime: window.performance.now(),
	canvas: document.querySelector("#myCanv"),
	width: 800,
	height: 451,
	frameInterval: 1000 / 60,
	ratio: 1.77,
	currentUser: "paddleRight",
	ballConfig: {
		texture: "/imgs/ball.png", 
		size: 20
	},
	padleRightConfig: {
		width: 20,
		height: 100,
		texture: "/imgs/pill.png",
		x: 0,
		y: 0,
	},
	padleLeftConfig: {
		width: 20,
		height: 100,
		texture: "/imgs/pill.png",
		x: 0,
		y: 0,
	}
})

function animate()
{
	requestAnimationFrame(animate);
	const now = window.performance.now();
	const deltaTime = now - previousTime;
	if (deltaTime < frameInterval) {
		return;
	}
	previousTime = now;
	
	game.ball.calculatePosition();
	game.draw();
}
animate();
