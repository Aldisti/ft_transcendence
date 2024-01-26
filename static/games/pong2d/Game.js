import Ball from "/games/pong2d/Ball.js"
import Paddle from "/games/pong2d/Paddle.js"
import * as API from"/API/APICall.js"


let upFlag = true;
let downFlag = true;

let upMsg = true;
let downMsg = true;

function handleUnload(game) {
    document.removeEventListener("keydown", game.downHandler);
    document.removeEventListener("keyup", game.upHandler);

    clearInterval(game[game.currentUser].downInterval)
    clearInterval(game[game.currentUser].upInterval)
}

function handleKeyDown(game, e){
    if (window.location.href != game.actualHref){
        handleUnload(game);
        return ;
    }
    if (e.key == "w" && upFlag){
        upFlag = false;
        game[game.currentUser].upInterval = setInterval(() => {
            if (upMsg){
                game.socket.send(JSON.stringify({type: `up_${game.currentUser == "paddleLeft" ? `left` : `right`}`}))
                upMsg = false;
            }
            game[game.currentUser].calculatePosition(false)
        }, game.frameInterval / 10);
    }
    if (e.key == "s" && downFlag){
        downFlag = false;
        game[game.currentUser].downInterval = setInterval(() => {
            if (downMsg){
                game.socket.send(JSON.stringify({type: `down_${game.currentUser == "paddleLeft" ? `left` : `right`}`}))
                downMsg = false;
            }
            game[game.currentUser].calculatePosition(true)
        }, game.frameInterval / 10);
    }
}

let sync = false;
function handleKeyUp(game, e){
    if (window.location.href != game.actualHref){
        handleUnload(game);
        return ;
    }
    if (e.key == "p")
        sync = true
    if (e.key == "w"){
        upFlag = true
        game.socket.send(JSON.stringify({type: `${game.currentUser == "paddleLeft" ? `left` : `right`}`}))
        upMsg = true;
        downMsg = true;
        clearInterval(game[game.currentUser].upInterval)
    }
    if (e.key == "s"){
        downFlag = true
        game.socket.send(JSON.stringify({type: `${game.currentUser == "paddleLeft" ? `left` : `right`}`}))
        downMsg = true;
        upMsg = true;
        clearInterval(game[game.currentUser].downInterval)
    }
}


function handleSocketMesssage(game, message){
	let coordinates = JSON.parse(message.data).objects;
	if (coordinates != undefined){
        if ((coordinates.ball.vel_x != game.ball.deltaX || coordinates.ball.vel_y != game.ball.deltaY)
            || (Math.abs(coordinates.ball.x - game.ball.x) > 5  || Math.abs(coordinates.ball.y - game.ball.y) > 5)){
            game.ball.updatePosition(coordinates.ball.x, coordinates.ball.y, coordinates.ball.vel_x, coordinates.ball.vel_y);
            game.positionUpdated = true
        }
		game.paddleLeft.updatePosition(coordinates.paddle_left.x, coordinates.paddle_left.y)
		game.paddleRight.updatePosition(coordinates.paddle_right.x, coordinates.paddle_right.y)
    }
}

export default class {
    constructor(gameCfg){
        this.previusTime = gameCfg.previousTime;
        this.frameInterval = gameCfg.frameIntervall;
        this.width = gameCfg.width;
        this.height = gameCfg.height;
        this.ratio = gameCfg.ratio;
        this.canvas = gameCfg.canvas;
        this.currentUser = gameCfg.currentUser;
        this.canvas.width =  gameCfg.width;
        this.canvas.height = gameCfg.height;
        this.texture = gameCfg.texture == undefined ? "" : gameCfg.texture;
        this.paddleLeft = new Paddle(this.canvas, gameCfg.padleLeftConfig)
        this.paddleRight = new Paddle(this.canvas, gameCfg.padleRightConfig)
        this.ball = new Ball(this.canvas, gameCfg.ballConfig)
        this.ctx = gameCfg.canvas.getContext("2d");
        this.image =  new Image()
        this.image.src = this.texture;
        this.positionUpdated = false;

        this.actualHref = window.location.href;
        this.upHandler = handleKeyUp.bind(null, this)
        this.downHandler = handleKeyDown.bind(null, this)

        document.addEventListener("keyup", this.upHandler)
        document.addEventListener("keydown", this.downHandler)

        API.startQueque(1).then(res=>{
            this.socket = new WebSocket(`ws://localhost:7000/ws/game/socket/?ticket=${res.ticket}&username=${localStorage.getItem("username")}`);
            this.socket.addEventListener("message", handleSocketMesssage.bind(null, this))
        })
        this.getRefreshRate(2).then((estimatedFps)=>{
            console.log(estimatedFps)
            this.ball.fps = estimatedFps
        })
    }

    draw(){
        if (this.texture == ""){
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else{
            this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height)
        }
        this.ball.draw();
        this.paddleLeft.draw();
        this.paddleRight.draw();
    }

    getRefreshRate(iterations = 3) {
        return new Promise((resolve) => {
            let frameCount = 0;
            let startTime;
            let iterationCount = 0;
    
            function countFrames(timestamp) {
                if (!startTime) {
                    startTime = timestamp;
                }
    
                frameCount++;
    
                if (timestamp - startTime > 1000) {
                    iterationCount++;
    
                    if (iterationCount === iterations) {
                        const refreshRate = frameCount / ((timestamp - startTime) / 1000);
                        resolve(refreshRate.toFixed(2));
                        iterationCount = 0;
                    } else {
                        frameCount = 0;
                        startTime = timestamp;
                        requestAnimationFrame(countFrames);
                    }
                } else {
                    requestAnimationFrame(countFrames);
                }
            }
            requestAnimationFrame(countFrames);
        });
    }
}