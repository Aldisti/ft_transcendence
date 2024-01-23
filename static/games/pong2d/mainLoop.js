import Game from "/games/pong2d/Game.js"

// API.getTicket(1).then(res=>{
	let socket = new WebSocket(`ws://localhost:8000/ws/game/socket/`)
	const 	targetFrameRate = 144; // Target frame rate (in FPS)
	const 	frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames
	let 	previousTime = 0;
	let gameConfig = {
		canvas: document.querySelector("#myCanv"),
		width: 800,
		height: 600,
		ratio: 1.77,
		ballConfig: {
			texture: "/imgs/ball.png", 
			size: 20
		},
		padleRightConfig: {
			width: 20,
			height: 90,
			x: 0,
			y: 0,
		},
		padleLeftConfig: {
			width: 20,
			height: 90,
			x: 0,
			y: 0,
		}
	}
	let game = new Game(gameConfig)
	socket.addEventListener("message", (message)=>{
		let coordinates = JSON.parse(message.data).objects;
		if (coordinates != undefined && coordinates.ball != undefined && coordinates.paddle_left != undefined && coordinates.paddle_right != undefined)
		{
			game.ball.updatePosition(coordinates.ball.x, coordinates.ball.y);
			game.paddleLeft.updatePosition(coordinates.paddle_left.x, coordinates.paddle_left.y)
			game.paddleRight.updatePosition(coordinates.paddle_right.x, coordinates.paddle_right.y)
		}
		game.draw();
	})

	document.addEventListener("keydown", (e)=>{
		if (e.key == "ArrowUp")
			socket.send(JSON.stringify({type: "up"}))
		if (e.key == "ArrowDown")
			socket.send(JSON.stringify({type: "down"}))
	})
	document.addEventListener("keyup", (e)=>{
		if (e.key == "ArrowUp")
			socket.send(JSON.stringify({type: "none"}))
		if (e.key == "ArrowDown")
			socket.send(JSON.stringify({type: "none"}))
	})
	
	// function animate(currentTime)
	// {
	// 	// const deltaTime = currentTime - previousTime;

	// 	// if (deltaTime > frameInterval) {
	// 		// previousTime = currentTime - (deltaTime % frameInterval);
	// 		game.draw();
	// 	// }
	// 	requestAnimationFrame(animate);
	// }
	// animate();
// }
