// let canvas = document.querySelector("#myCanv");
// let ai = false;
// canvas.width = 800
// canvas.height = 450

// class Game{
// 	constructor(){
// 		this.p1Score = 0;
// 		this.p2Score = 0;
// 	}
// 	updateObj(left, right, ball, newLeftY, newRightY){
// 		let aiMove = ball.y + canvas.offsetTop - (right.lengthP / 2);
// 		left.update(newLeftY);
// 		if (ai)
// 			right.update(aiMove);
// 		else
// 			right.update(newRightY)
// 		ball.update(left, right, this);
// 	}
// 	drawFrame(left, right, ball){
// 		ctx.fillStyle = "#000000"
// 		ctx.fillRect(0, 0, canvas.width, canvas.height)
// 		ctx.fillStyle = "#ffffff"
// 		ctx.fillRect(left.x, left.y, left.widthP, left.lengthP)
// 		ctx.fillStyle = "#ffffff"
// 		ctx.fillRect(right.x, right.y, right.widthP, right.lengthP)
// 		ctx.fillStyle = "#ffffff"
// 		ctx.fillRect(ball.x, ball.y , ball.ballSize, ball.ballSize);
// 	}
// 	updateScore(ball){
// 		if (!ai)
// 			document.querySelector("#display").innerHTML = `<span>P1: ${this.p1Score} | P2: ${this.p2Score}</span>`;
// 		ball.resetPos();
// 	}
// }

// class Padle{
// 	constructor(startX, startY, width, length){
// 		this.x = startX;
// 		this.y = startY;
// 		this.widthP = width;
// 		this.lengthP = length;
// 		this.rect = canvas.getBoundingClientRect();
// 	}
// 	update(y){
// 		this.y = y - this.rect.top;
// 	}
// }

// class Ball{
// 	constructor(canvas){
// 		this.centerX = (canvas.width / 2);
// 		this.centerY = (canvas.height / 2);
// 		this.ballSize = 10;
// 		this.ballOffSet = (this.ballSize / 2);
// 		this.x = this.centerX - this.ballOffSet;
// 		this.y = this.centerY - this.ballOffSet;
// 		this.deltaX = 0;
// 		this.deltaY = 0;
// 		this.started = false;
// 		this.rect = canvas.getBoundingClientRect();
// 	}
// 	resetPos(){
// 		this.started = false;
// 		ball.deltaX = 0;
// 		ball.deltaY = 0;
// 		ball.x = ball.centerX - ball.ballOffSet;
// 		ball.y = ball.centerY - ball.ballOffSet;
// 	}
// 	start(){
// 		this.started = true;
// 		date = new Date().getTime() / 1000;
// 		this.deltaX = Math.ceil(Math.random() * 10) % 2 == 0 ? 2.5 + Math.random() : -2.5 - Math.random();
// 		this.deltaY = Math.ceil(Math.random() * 10) % 2 == 0 ? 2.5 + Math.random() : -2.5 - Math.random();
// 	}
// 	touchPadel(leftPadle, rightPadle){
// 		let topSpeed = 8;
// 		if (this.x + this.ballOffSet <= (leftPadle.x + leftPadle.widthP))
// 		{
// 			if (this.y + this.ballSize >= leftPadle.y && this.y <= (leftPadle.y + leftPadle.lengthP))
// 			{
// 				this.deltaX *= -7;
// 				if (this.deltaX > topSpeed)
// 					this.deltaX = topSpeed;
// 				else if (this.deltaX < -topSpeed)
// 					this.deltaX = -topSpeed;
// 				this.deltaY *= 7;
// 				if (leftSpecial)
// 					this.deltaY *= -7;
// 				if (this.deltaY > topSpeed)
// 					this.deltaY = topSpeed;
// 				else if (this.deltaY < -topSpeed)
// 					this.deltaY = -topSpeed;
// 				return "none";
// 			}
// 			return "outLeft";
// 		}
// 		if (this.x + this.ballOffSet >= rightPadle.x)
// 		{
// 			if (this.y + this.ballSize >= rightPadle.y && this.y <= (rightPadle.y + rightPadle.lengthP))
// 			{
// 				this.deltaX *= -7;
// 				if (this.deltaX > topSpeed)
// 					this.deltaX = topSpeed;
// 				else if (this.deltaX < -topSpeed)
// 					this.deltaX = -topSpeed;
// 				this.deltaY *= 7;
// 				if (rightSpecial)
// 					this.deltaY *= -7;
// 				if (this.deltaY > topSpeed)
// 					this.deltaY = topSpeed;
// 				else if (this.deltaY < -topSpeed)
// 					this.deltaY = -topSpeed;
// 				return "none";
// 			}
// 			return "outRight";
// 		}
// 		return "none";
// 	}
// 	update(leftPadel, rightPadel, game){
// 		let res;
		
// 		if (this.started && ai)
// 			getTimeHtml();
// 		if (this.x <= 0 || this.x >= canvas.width - this.ballOffSet)
// 			this.deltaX *= -1;
// 		if (this.y <= 0 || this.y >= canvas.height - this.ballOffSet)
// 			this.deltaY *= -1;
// 		res = this.touchPadel(leftPadel, rightPadel);
// 		if (res == "outLeft")
// 		{
// 			game.p2Score++;
// 			game.updateScore(this);
// 		}
// 		if (res == "outRight")
// 		{
// 			game.p1Score++;
// 			game.updateScore(this);
// 		}
// 		if (this.deltaX > 3 || this.deltaX < -3)
// 			this.deltaX *= 0.99599;
// 		if (this.deltaY > 3 || this.deltaY < -3)
// 			this.deltaY *= 0.99599;
// 		this.x += this.deltaX;
// 		this.y += this.deltaY;
// 	}
// }

// let 	ctx = canvas.getContext("2d");
// let 	padleWidth = 10, padlelength = canvas.height / 6;
// let 	leftY = canvas.offsetTop + canvas.clientHeight / 2 - (padlelength / 2);
// let 	rightY = canvas.offsetTop  + canvas.clientHeight / 2 - (padlelength / 2);
// let 	ball = new Ball(canvas);
// let 	left = new Padle(20, leftY, padleWidth, padlelength)
// let 	right = new Padle(canvas.width - (padleWidth + 20), leftY, padleWidth, padlelength);
// let 	game = new Game();
// let 	previousTime = 0;
// let 	date = new Date().getTime() / 1000;
// const 	targetFrameRate = 144; // Target frame rate (in FPS)
// const 	frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames
// let		leftSpecial = false;
// let		rightSpecial = false;

// let leftPadleTInterval;
// let leftPadleBInterval;
// let leftControlTop = false;
// let leftControlBot = false;

// let rightPadleTInterval;
// let rightPadleBInterval;
// let rightControlTop = false;
// let rightControlBot = false;

// function getTimeHtml(){
// 	document.querySelector("#display").innerHTML = `<span>Elapsed Time: ${Math.round(((new Date().getTime() / 1000) - date))}</span>`;
// }


// window.addEventListener("keydown", (e)=>{
// 	let toAdd = 3;
// 	if (e.key == " ")
// 	{
// 		e.preventDefault();
// 		ball.start();
// 	}
// 	if (e.key == "o"&& !rightControlTop)
// 	{
// 		if (rightControlBot)
// 		{
// 			clearInterval(rightPadleBInterval)
// 			rightControlBot = false;
// 		}
// 		rightControlTop = true;
// 		rightPadleTInterval = setInterval(()=>{
// 			if ((rightY - toAdd) >= canvas.offsetTop  - 10)
// 				rightY -= toAdd;
// 		}, 1)
// 	}
// 	if (e.key == "l"  && !rightControlBot)
// 	{
// 		if (rightControlTop)
// 		{
// 			clearInterval(rightPadleTInterval)
// 			rightControlTop = false;
// 		}
// 		rightControlBot = true;
// 		rightPadleBInterval = setInterval(()=>{
// 			if ((rightY + toAdd) <= canvas.clientHeight + canvas.offsetTop - right.lengthP + 10)
// 				rightY += toAdd;
// 		}, 1)
// 	}
// 	if (e.key == "w" && !leftControlTop)
// 	{
// 		if (leftControlBot)
// 		{
// 			clearInterval(leftPadleBInterval)
// 			leftControlBot = false;
// 		}
// 		leftControlTop = true;
// 		leftPadleTInterval = setInterval(()=>{
// 			if ((leftY - toAdd) >= canvas.offsetTop - 10)
// 				leftY -= toAdd;
// 		}, 1)
// 	}
// 	if (e.key == "s" && !leftControlBot)
// 	{
// 		if (leftControlTop)
// 		{
// 			clearInterval(leftPadleTInterval)
// 			leftControlTop = false;
// 		}
// 		leftControlBot = true;
// 		leftPadleBInterval = setInterval(()=>{
// 			if ((leftY + toAdd) <= canvas.clientHeight + canvas.offsetTop - right.lengthP + 10)
// 				leftY += toAdd;
// 		}, 1)
// 	}
// 	if (e.key == "a")
// 		leftSpecial = true;
// 	if (e.key == "p")
// 		rightSpecial = true;
// })

//     window.addEventListener("keyup", (e)=>{
// 		if (e.key == "w")
//         {
//             clearInterval(leftPadleTInterval)
//             leftControlTop = false;
//         }
//         if (e.key == "s")
//         {
//             clearInterval(leftPadleBInterval)
//             leftControlBot = false;
//         }
//         if (e.key == "o")
//         {
//             clearInterval(rightPadleTInterval)
//             rightControlTop = false;
//         }
//         if (e.key == "l")
//         {
//             clearInterval(rightPadleBInterval)
//             rightControlBot = false;
//         }
// 		if (e.key == "a")
// 			leftSpecial = false;
// 		if (e.key == "p")
// 			rightSpecial = false;
//     })

// function animate(currentTime)
// {
// 	const deltaTime = currentTime - previousTime;
// 	game.updateObj(left, right, ball, leftY, rightY);
// 	if (deltaTime > frameInterval) {
// 		previousTime = currentTime - (deltaTime % frameInterval);
// 		game.drawFrame(left, right, ball)
// 	}
// 	requestAnimationFrame(animate);
// }

// document.querySelector(".single").addEventListener("click", ()=>{
// 	ai = true;
// 	document.querySelector("#display").innerHTML = `<span>Elapsed Time: 0</span>`;
// })

// document.querySelector(".multi").addEventListener("click", ()=>{
// 	ai = false;
// 	game.p1Score = 0
// 	game.p2Score = 0
// 	document.querySelector("#display").innerHTML = `<span>P1: ${game.p1Score} | P2: ${game.p2Score}</span>`;
// })

// animate()