import Ball from "./ball.js"

let socket = new WebSocket("ws://localhost:3000")

const 	targetFrameRate = 144; // Target frame rate (in FPS)
const 	frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames

let 	previousTime = 0;
let x = 0, y = 0;
let canvas = document.querySelector("#myCanv");
canvas.width = 800
canvas.height = 450
let ball = new Ball(canvas, 40);

socket.addEventListener("message", (message)=>{
    let coordinates = JSON.parse(message.data);
    
    x = coordinates.x + ball.objOffSet.left;
    y = coordinates.y + ball.objOffSet.top;
})

function animate(currentTime)
{
	const deltaTime = currentTime - previousTime;
	if (deltaTime > frameInterval) {
		previousTime = currentTime - (deltaTime % frameInterval);
        ball.draw(x, y);
	}
	requestAnimationFrame(animate);
}

animate();