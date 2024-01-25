import Ball from "/games/pong2d/Ball.js"
import Paddle from "/games/pong2d/Paddle.js"

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

function handleKeyUp(game, e){
    if (window.location.href != game.actualHref){
        handleUnload(game);
        return ;
    }
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
		game.ball.updatePosition(coordinates.ball.x, coordinates.ball.y, coordinates.ball.vel_x, coordinates.ball.vel_y);
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

        this.actualHref = window.location.href;
        this.upHandler = handleKeyUp.bind(null, this)
        this.downHandler = handleKeyDown.bind(null, this)

        document.addEventListener("keyup", this.upHandler)
        document.addEventListener("keydown", this.downHandler)

        this.socket = new WebSocket(`ws://localhost:8000/ws/game/socket/`);
        this.socket.addEventListener("message", handleSocketMesssage.bind(null, this))
    }

    draw(x, y){
        if (this.texture == ""){
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }else{
            this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height)
        }
        this.ball.draw();
        this.paddleLeft.draw();
        this.paddleRight.draw();
    }
}