import Game from "/games/pong2d/Game.js"

// API.getTicket(1).then(res=>{
	let socket = new WebSocket(`ws://localhost:8000/ws/game/socket/`)
	const 	targetFrameRate = 60; // Target frame rate (in FPS)
	const 	frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames
	let 	previousTime = 0;
	let gameConfig = {
		canvas: document.querySelector("#myCanv"),
		width: 800,
		height: 451,
		ratio: 1.77,
		ballConfig: {
			texture: "/imgs/ball.png", 
			size: 20
		},
		padleRightConfig: {
			width: 20,
			height: 100,
			x: 0,
			y: 0,
		},
		padleLeftConfig: {
			width: 20,
			height: 100,
			x: 0,
			y: 0,
		}
	}
	let game = new Game(gameConfig)

	socket.addEventListener("message", (message)=>{
		let coordinates = JSON.parse(message.data).objects;

		if (coordinates.ball)
			game.ball.updatePosition(coordinates.ball.x, coordinates.ball.y, coordinates.ball.vel_x, coordinates.ball.vel_y);
		if (coordinates.paddle_left != undefined)
			game.paddleLeft.updatePosition(coordinates.paddle_left.x, coordinates.paddle_left.y)
		if (coordinates.paddle_right != undefined)
			game.paddleRight.updatePosition(coordinates.paddle_right.x, coordinates.paddle_right.y)
	})

	let sendMessage = true;
	let sendMessageRight = true;
	
	document.addEventListener("keydown", (e)=>{
		if (e.key == "p"){
			console.log("test")
			window.sync = true;
		}
		if (e.key == "ArrowUp" && sendMessageRight){
			socket.send(JSON.stringify({type: "up_right"}))
			sendMessageRight = false;
		}
		if (e.key == "ArrowDown" && sendMessageRight){
			socket.send(JSON.stringify({type: "down_right"}))
			sendMessageRight = false;
		}
		if (e.key == "w" && sendMessage){
			socket.send(JSON.stringify({type: "up_left"}))
			sendMessage = false;
		}
		if (e.key == "s" && sendMessage){
			socket.send(JSON.stringify({type: "down_left"}))
			sendMessage = false;
		}
	})
	document.addEventListener("keyup", (e)=>{
		if (e.key == "w")
		{
			socket.send(JSON.stringify({type: "left"}))
			sendMessage = true;
		}
		if (e.key == "s"){
			socket.send(JSON.stringify({type: "left"}))
			sendMessage = true;
		}
		if (e.key == "ArrowUp")
		{
			socket.send(JSON.stringify({type: "right"}))
			sendMessageRight = true;
		}
		if (e.key == "ArrowDown"){
			socket.send(JSON.stringify({type: "right"}))
			sendMessageRight = true;
		}
	})
	
	function animate(currentTime)
	{
		const deltaTime = currentTime - previousTime;

		game.ball.calculatePosition();
		if (deltaTime >= frameInterval) {
			previousTime = currentTime - (deltaTime % frameInterval);
			game.draw();
		}
		requestAnimationFrame(animate);
	}
	animate();
// }
